import React from 'react';
import { View, Dimensions} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Spinner, Icon, Header, Item, Input, Picker } from 'native-base';
import Config from '../config/config.js';
import _ from 'lodash';

export default class ListadoMuestras extends React.Component{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <HeaderNav section="Muestras"/>,
            headerRight: <MenuHeaderButton navigation={navigation} />
        };
    };

    state = {
        datos: [],
        refrescando : true,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: this.props.navigation.getParam('idVendedor', -1),
        heightDevice: Dimensions.get('screen').height,
        mostrarDatos: null,
        opacityValue: 0,
        AnioConsulta: (new Date()).getFullYear(),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        primeraVez: true,
    }

    componentDidMount(){
        //this.setState({idVendedor: this.props.navigation.getParam('idVendedor', -1)});
        // Obtenemos los años para el Picker.
        this.ConsultarAniosPosibles();
        this._ReGenerarItems();
        this.setState({refrescando: false, heightDevice: Dimensions.get('screen').height});
    }

    ConsultarAniosPosibles(){
        Config.Consultar('AniosFiltro/' + this.state.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({Anios: resJson});
                });
        });
    }

    ConsultarUrlConsulta() {
        return fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({urlConsulta: responseJson[0].url + '/todas/' + this.state.idVendedor});
                    })
    }

    _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        this.setState({refrescando: true});

        return Config.Consultar('Muestras/' + this.state.idVendedor + '/' + this.state.AnioConsulta, (resp) => {
            resp.then((response) => response.json())
                .then((responseJson) => {
                    let _datos = [];

                    if (responseJson.length > 0) {
                        let res = _(responseJson)
                                    .groupBy('Vendedor')
                                    .map((muestras, vend) => (
                                        {
                                            Vendedor: vend,
                                            DesVendedor: muestras[0].DesVendedor,
                                            Datos: _(muestras).groupBy('Cliente')
                                                              .map((pedidos, cli) => (
                                                                {
                                                                    Cliente: cli,
                                                                    Razon: pedidos[0].Razon,
                                                                    Datos: _(pedidos).groupBy('Pedido')
                                                                                     .map((pedido, ped) => (
                                                                                        {
                                                                                            Pedido: ped,
                                                                                            Datos: pedido
                                                                                        }
                                                                                     )).value()
                                                                }
                                                              )).value()
                                        }
                                    ));

                        _datos = _.sortBy(res.value(), ['DesVendedor']);
                    }

                    if (this.state.primeraVez)
                        this.state.itemsFiltrados = _datos;

                    this.setState({
                        primeraVez: false,
                        refrescando: false,
                        datos: _datos
                    });

                })
                .catch((error) => console.error(error));
        });

        this.setState({refrescando: false});
    }

    _KeyExtractor = (item, index) => item.Pedido + '';

    _handlePickAnio = (val) => {
        this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
    }

    _handleChangeTextFiltro = (val) => {
        this.setState({textFilter: val.trim()});

        let _itemsFiltrados = [];
        if (val.trim() == ""){
            _itemsFiltrados = this.state.datos;
        }else{
            const regex1 = new RegExp(val.toUpperCase());
            _.forEach(this.state.datos, (vendedor) => {
                let filtrados = _.filter(vendedor.Datos, (Cliente) => {
                    return regex1.test(Cliente.Razon.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase()) ;
                });
                if (filtrados.length > 0)
                    _itemsFiltrados.push({Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados});
            });
        }
        this.setState({itemsFiltrados: _itemsFiltrados});
    }

    handleOnPressDetalles = (parameters) => this.props.navigation.navigate('Detalles', parameters); 

    RenderCliente = itemCliente => (
            <ListItem key={itemCliente.Cliente} onPress={() => this.handleOnPressDetalles({Cliente: itemCliente})}>
                <View key={itemCliente.Cliente} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 10, fontStyle: 'italic'}}>
                            ({itemCliente.Cliente})
                        </Text>
                        <Text style={{marginLeft: 10, maxWidth: 230}}>
                            {itemCliente.Razon.trim()}
                        </Text>
                    </View>
                    
                    <Text style={{fontSize: 10, fontStyle: 'italic'}}>

                        {itemCliente.Datos.length} Pedido(s)

                    </Text>
                </View>
            </ListItem>
    )

    RenderVendedor = item => (
        <View key={item.Vendedor}>
            <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center'}}>
                <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>{item.DesVendedor}</Text>
            </ListItem>
            <List
                dataArray={item.Datos}
                renderRow={this.RenderCliente}>
            </List>
        </View>
    )

    render(){
        if (this.state.refrescando) return (
            <Container>
                <Content>
                        <Spinner color={Config.bgColorTerciario}/>
                </Content>
            </Container>
        );

        return (
            <Container>
                <Header searchBar rounded  style={{backgroundColor: Config.bgColorSecundario}}>
                    <Item style={{flex: 2}}>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={this._handleChangeTextFiltro} value={this.state.textFilter}/>
                    </Item>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80}}>
                        <Text style={{color: '#fff'}}>Periodo:</Text>
                        <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.AnioConsulta}
                        style={{color: '#fff'}}
                        // onValueChange={this.onValueChange.bind(this)}
                        onValueChange={this._handlePickAnio}
                        >
                            {this.state.Anios.map(anio => <Picker.Item key={anio.Valor} label={anio.Valor} value={anio.Valor} /> )}
                        </Picker>
                    </View>
                </Header>
                <Content>
                    <List
                        dataArray={this.state.itemsFiltrados}
                        renderRow={this.RenderVendedor}
                    >

                    </List>
                </Content>
            </Container>
        )
    }
}

// const styles = StyleSheet.create({
//     container: {
//         // backgroundColor: '#d6deeb'
//     }
// });