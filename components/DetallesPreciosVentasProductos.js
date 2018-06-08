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

export default class DetallesPreciosVentasProductos extends React.Component{
    
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
                itemsFiltrados: this.props.navigation.getParam('Producto', [])
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

            _.forEach(this.state.datos, (vendedor) => {
                let exist = false;

                let filtrados = _.filter(vendedor.Datos, (Cliente) => {
                    let regex1 = new RegExp(val.toUpperCase());
                    return regex1.test(Cliente.Razon.toUpperCase()) || regex1.test(Cliente.Cliente.toUpperCase()) ;
                });

                if (filtrados.length > 0)
                    _itemsFiltrados.push({Vendedor: vendedor.Vendedor, DesVendedor: vendedor.DesVendedor, Datos: filtrados});

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
        const Producto = this.state.itemsFiltrados;
        const {Cliente, DesCliente} = Producto.Datos[0];
        console.log('Cliente: ' + Cliente, 'DesCliente: ' + DesCliente);
        return (
            <Container>
                <Header searchBar rounded  style={{backgroundColor: Config.bgColorSecundario}}>
                    <Item style={{flex: 2}}>
                        {/* <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={(val) => {this._handleChangeTextFiltro(val)}} value={this.state.textFilter}/> */}
                    </Item>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: 20, minWidth: 80}}>
                        {/* <Text style={{color: '#fff'}}>Período:</Text> */}
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
                    <Grid>
                        <Row style={[styles.row, {marginTop: 30}]}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Código</Text>
                            </Col>
                            <Col size={3} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Producto.Producto.trim()}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Producto</Text>
                            </Col>
                            <Col size={5} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Producto.DesProducto.trim()}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Cliente</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{Cliente}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Razón</Text>
                            </Col>
                            <Col size={6} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{DesCliente.trim()}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={2} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>Fecha</Text>
                            </Col>
                            <Col size={4} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>Cantidad (kg)</Text>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>$</Text>
                            </Col>
                            <Col size={3} style={[styles.bloqueAzul]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>u$s</Text>
                            </Col>
                        </Row>
                        {Producto.Datos.map((Prod, key) => {
                            return (
                                <Row key={key} style={styles.row}>
                                    <Col size={2} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                                        <Text style={styles.textoBloqueBlanco}>{Prod.Fecha}</Text>
                                    </Col>
                                    <Col size={4} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, justifyContent: 'flex-end'}]}>
                                        <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.Cantidad).toFixed(2)}</Text>
                                    </Col>
                                    <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                                        <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.Precio).toFixed(2)}</Text>
                                    </Col>
                                    <Col size={3} style={styles.bloqueBlanco}>
                                        <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.PrecioUs).toFixed(2)}</Text>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Grid>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff'
    },
    row: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        // padding: 10,
        marginHorizontal: 20
    },
    textoBloqueBlanco: {
        fontSize: 12,
    },
    textoBloqueazul: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloqueAzul: {
        backgroundColor: Config.bgColorSecundario,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    bloqueBlanco: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    }
});