import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import MenuHeaderButton from './MenuHeaderButton';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, Spinner, Icon, Header, Item, Input } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config.js';
import _ from 'lodash';

export default class DetallesPreciosPorCliente extends React.PureComponent{
    
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
        Cliente: this.props.navigation.getParam('Cliente', -1),
        heightDevice: Dimensions.get('screen').height,
        mostrarDatos: null,
        opacityValue: 0,
        AnioConsulta: (new Date()).getFullYear(),
        Anios: [],
        textFilter: '',
        itemsFiltrados: [],
        DesCliente: '',
        Productos: [],
        ProductosFiltrados: [],
        primeraVez: true,
    }

    componentDidMount(){
        this.setState(
            {
                refrescando: true
            },
            this._ReGenerarItems()
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

    _ReGenerarItems(){

        if (this.state.idVendedor <= 0) return;

        Config.Consultar('Precios/' + this.state.idVendedor + '/' + this.state.Cliente, (resp) => {
            resp.then((response) => response.json())
                .then((responseJson) => {
                    let _datos = [];
                    if (responseJson.length > 0) {
                        let res = _(responseJson)
                                    .groupBy('Cliente')
                                    .map((Productos, vend) => (
                                        {
                                            Cliente: vend,
                                            DesCliente: Productos[0].DesCliente,
                                            Datos: Productos
                                        }
                                    ));

                        _datos = res.value();
                    }

                    if (this.state.primeraVez){
                        this.setState({
                            itemsFiltrados: _datos,
                            DesCliente: _datos[0].DesCliente,
                            Productos: _datos[0].Datos,
                            ProductosFiltrados: _datos[0].Datos,
                        });
                    }

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

    // _KeyExtractor = (item, index) => item.Pedido + '';

    // _handlePickAnio(val){
    //     this.setState({AnioConsulta: val, textFilter: '', primeraVez: true}, this._ReGenerarItems);
    // }

    _handleChangeTextFiltro(val){
        this.setState({textFilter: val.trim()});

        let _Productos = [];
        if (val.trim() == ""){
            _Productos = this.state.Productos;
        }else{
            const regex1 = new RegExp(val.toUpperCase());
            let filtrados = _.filter(this.state.Productos, (Producto) => {
                return regex1.test(Producto.Terminado.toUpperCase()) || regex1.test(Producto.DesTerminado.toUpperCase()) ;
            });

            _Productos = filtrados;
        }

        this.setState({ProductosFiltrados: _Productos});
    }

    RenderProducto = (Prod, key) => {
        return (
            <Row key={key} style={styles.row}>
                <Col size={3} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                    <View>
                        <Text style={styles.textoBloqueBlanco}>{Prod.Terminado}</Text>
                    </View>
                </Col>
                <Col size={7} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1, alignItems: 'flex-start'}]}>
                    <View>
                        <Text style={[styles.textoBloqueBlanco, {paddingLeft: 5}]}>{Prod.DesTerminado.trim()}</Text>
                    </View>
                </Col>
                <Col size={2} style={[styles.bloqueBlanco, {borderRightColor: '#ccc', borderRightWidth: 1}]}>
                    <View>
                        <Text style={styles.textoBloqueBlanco}>{parseFloat(Prod.Valor).toFixed(2)}</Text>
                    </View>
                </Col>
            </Row>
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
                <Content style={styles.container}>
                    <Grid>
                        <Row style={[styles.row, {marginTop: 30}]}>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Cliente</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{this.state.Cliente}</Text>
                            </Col>
                            <Col size={2} style={styles.bloqueAzul} >
                                <Text style={styles.textoBloqueazul}>Razón</Text>
                            </Col>
                            <Col size={6} style={styles.bloqueBlanco}>
                                <Text style={styles.textoBloqueBlanco}>{this.state.DesCliente.trim()}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.row}>
                            <Col size={3} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>Código</Text>
                            </Col>
                            <Col size={7} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>Descripción</Text>
                            </Col>
                            <Col size={2} style={[styles.bloqueAzul, {borderRightColor: '#ccc', borderRightWidth: 1}]} >
                                <Text style={[styles.textoBloqueazul, {fontSize: 12}]}>Precio</Text>
                            </Col>
                        </Row>
                        {this.state.ProductosFiltrados.map(this.RenderProducto)}
                    </Grid>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    row: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginHorizontal: 5
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
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    }
});