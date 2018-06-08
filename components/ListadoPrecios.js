import React from 'react';
import {StyleSheet, Image, View, FlatList, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import ItemListado from './ItemListado.js';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Separator, Spinner, Icon, Header, Item, Button, Input, Picker } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';

export default class ListadoPrecios extends React.Component{
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <HeaderNav />,
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
        //this.ConsultarAniosPosibles();
        return this._ReGenerarItems();
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

    _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        this.setState({refrescando: true});

        return Config.Consultar('Precios/' + this.state.idVendedor , (resp) => {
            resp.then((response) => response.json())
                .then((responseJson) => {
                    let _datos = [];

                    if (responseJson.length > 0) {
                        let res = _(responseJson)
                                    .groupBy('Vendedor')
                                    .map((Clientes, vend) => (
                                        {
                                            Vendedor: vend,
                                            DesVendedor: Clientes[0].DesVendedor,
                                            Datos: Clientes
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

    _handlePickAnio(val){
        this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
    }

    _handleChangeTextFiltro(val){
        this.setState({textFilter: val.trim()});

        let itemsOriginales = this.state.datos;
        let _itemsFiltrados = [];
        if (val.trim() == ""){
            _itemsFiltrados = this.state.datos;
        }else{

            _.forEach(this.state.datos, (vendedor) => {
                let exist = false;

                let filtrados = _.filter(vendedor.Datos, (Cliente) => {
                    let regex1 = new RegExp(val.toUpperCase());
                    return regex1.test(Cliente.DesCliente.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase()) ;
                });

                if (filtrados.length > 0)
                    _itemsFiltrados.push({Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados});

            });
        }

        this.setState({itemsFiltrados: _itemsFiltrados});
    }

    RenderCliente  =({item}) => {
        return (
             <ListItem key={item.Cliente} onPress={() => {this.props.navigation.navigate('DetallesPreciosPorCliente', {idVendedor: this.state.idVendedor ,Cliente: item.Cliente})}}>
                 <View key={item.Cliente} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                     <View style={{flexDirection: 'row'}}>
                         <Text style={{fontSize: 10, fontStyle: 'italic', marginRight: 10}}>
                             ({item.Cliente})
                         </Text>
                         <Text style={{marginLeft: 30}}>
                             {item.DesCliente}
                         </Text>
                     </View>
                     
                     <Text style={{fontSize: 10, fontStyle: 'italic'}}>

                         {item.CantTerminados} Productos(s)

                     </Text>
                 </View>
             </ListItem>
        ) 
     }

    RenderClientes = ({item}) => {
        return (
            <View key={item.Vendedor}>
                <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>{item.DesVendedor.trim()}</Text>
                </ListItem>
                <FlatList
                    data={_.sortBy(item.Datos, ['DesCliente'])}
                    keyExtractor={item => item.Cliente}
                    renderItem={this.RenderCliente}>
                    
                </FlatList>
            </View>
        )
    }

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
                        <Input placeholder="Search" onChangeText={(val) => {this._handleChangeTextFiltro(val)}} value={this.state.textFilter}/>
                    </Item>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80}}>
                    </View>
                </Header>
                <Content>
                    <FlatList
                        data={this.state.itemsFiltrados}
                        keyExtractor={item => item.Vendedor}
                        renderItem={this.RenderClientes}
                        initialNumToRender={11}
                        windowSize={1}
                    >
                    </FlatList>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#d6deeb'
    }
});