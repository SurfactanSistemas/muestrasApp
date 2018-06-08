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

export default class DetallesVentasProductos extends React.Component{
    
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
        // return this._ReGenerarItems();
        this.setState(
            {
                refrescando: false,
                heightDevice: Dimensions.get('screen').height,
                itemsFiltrados: this.props.navigation.getParam('ClienteProductos', []),
                datos: this.props.navigation.getParam('ClienteProductos', [])
            }
        );
    }

    ConsultarAniosPosibles(){
        Config.Consultar('AniosFiltro/' + this.state.idVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((resJson) => {
                    this.setState({Anios: resJson});
                });
        });
    }

    // _ReGenerarItems(){

    //     if (this.state.idVendedor <= 0) return;

    //     this.setState({refrescando: true});

    //     return Config.Consultar('Estadisticas/' + this.state.idVendedor + '/' + this.state.AnioConsulta, (resp) => {
    //         resp.then((response) => response.json())
    //             .then((responseJson) => {
    //                 let _datos = [];

    //                 if (responseJson.length > 0) {
    //                     let res = _(responseJson)
    //                                 .groupBy('Vendedor')
    //                                 .map((Ventas, vend) => (
    //                                     {
    //                                         Vendedor: vend,
    //                                         DesVendedor: Ventas[0].DesVendedor,
    //                                         Datos: _(Ventas).groupBy('Cliente')
    //                                                           .map((Clientes, cli) => (
    //                                                             {
    //                                                                 Cliente: cli,
    //                                                                 DesCliente: Clientes[0].DesCliente,
    //                                                                 Datos: _(Clientes).groupBy('Producto')
    //                                                                                  .map((Productos, prod) => (
    //                                                                                     {
    //                                                                                         Producto: prod,
    //                                                                                         Datos: Productos
    //                                                                                     }
    //                                                                                  )).value()
    //                                                             }
    //                                                           )).value()
    //                                     }
    //                                 ));

    //                     _datos = _.sortBy(res.value(), ['DesVendedor']);
    //                 }

    //                 if (this.state.primeraVez)
    //                     this.state.itemsFiltrados = _datos;

    //                 this.setState({
    //                     primeraVez: false,
    //                     refrescando: false,
    //                     datos: _datos
    //                 });

    //             })
    //             .catch((error) => console.error(error));
    //     });

    //     this.setState({refrescando: false});
    // }

    // _KeyExtractor = (item, index) => item.Pedido + '';

    // _handlePickAnio(val){
    //     this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
    // }

    _handleChangeTextFiltro(val){
        this.setState({textFilter: val.trim()});

        let itemsOriginales = this.state.datos;
        let _itemsFiltrados = [];
        if (val.trim() == ""){
            _itemsFiltrados = this.state.datos;
        }else{

            _.forEach(this.state.datos, (Productos) => {
                let exist = false;

                let filtrados = _.filter(Productos.Datos, (Producto) => {
                    let regex1 = new RegExp(val.toUpperCase());
                    return regex1.test(Producto.Producto.toUpperCase()) || regex1.test(Producto.DesProducto.toUpperCase()) ;
                });

                if (filtrados.length > 0)
                    _itemsFiltrados.push({Cliente: Productos.Cliente, DesCliente: Productos.DesCliente, Datos: filtrados});

            });
        }

        this.setState({itemsFiltrados: _itemsFiltrados});
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
                        {/* <Text style={{color: '#fff'}}>Periodo:</Text> */}
                        {/* <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.AnioConsulta}
                        style={{color: '#fff'}}
                        // onValueChange={this.onValueChange.bind(this)}
                        onValueChange={(val) => this._handlePickAnio(val)}
                        >
                        <Picker.Item key='2018' label='2018' value='2018' />
                        </Picker> */}
                    </View>
                </Header>
                <Content>
                <List
                        dataArray={this.state.itemsFiltrados}
                        renderRow={(item) => {
                            return (
                                <View key={item.Cliente}>
                                    <ListItem itemHeader key={item.Cliente} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>{item.DesCliente.trim()}</Text>
                                    </ListItem>
                                    <List
                                        dataArray={item.Datos}
                                        renderRow={(itemProducto) => {
                                           return (
                                                <ListItem key={itemProducto.Cliente} onPress={() => {this.props.navigation.navigate('DetallesPreciosVentasProductos', {Producto: itemProducto})}}>
                                                    <Grid>
                                                        <Row key={itemProducto.Cliente} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                            <Col size={2}>
                                                                <Row>
                                                                    <Text style={{fontSize: 10, fontStyle: 'italic', marginRight: 10}}>
                                                                        ({itemProducto.Producto})
                                                                    </Text>
                                                                </Row>
                                                            </Col>
                                                            <Col size={8} style={{alignItems: 'flex-start'}}>
                                                                <Row>
                                                                    <Text style={{flex: 1}}>
                                                                        {itemProducto.DesProducto.trim()}
                                                                    </Text>
                                                                </Row>
                                                            </Col>
                                                            <Col size={2}>
                                                                <Row>
                                                                    <Text style={{fontSize: 10, fontStyle: 'italic'}}>
                                                                        {itemProducto.Datos.length} Venta(s)
                                                                    </Text>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Grid>
                                                    {/* <View key={itemProducto.Cliente} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                                                        <View style={{flexDirection: 'row'}}>
                                                            <Text style={{fontSize: 10, fontStyle: 'italic', marginRight: 10}}>
                                                                ({itemProducto.Producto})
                                                            </Text>
                                                            <Text style={{marginLeft: 30}}>
                                                                {itemProducto.DesProducto}
                                                            </Text>
                                                        </View>
                                                        
                                                        <Text style={{fontSize: 10, fontStyle: 'italic'}}>

                                                            {itemProducto.Datos.length} Ventas(s)

                                                        </Text>
                                                    </View> */}
                                                </ListItem>
                                           ) 
                                        }}>
                                        
                                    </List>
                                </View>
                            )
                        }}
                    >

                    </List>
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