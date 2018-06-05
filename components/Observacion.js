import React from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { createStackNavigator} from 'react-navigation';
import HeaderNav from './HeaderNav.js';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Text, Textarea, Button, Spinner } from 'native-base';
import Config from '../config/config';

export default class Observacion extends React.Component {

    static navigationOptions = {
        headerTitle: <HeaderNav />,
    };

    constructor(props){
        super(props);
        this.state = {
            Observaciones: '',
            loading: false,
            Sending: false
        }
        this.Pedido = this.props.navigation.getParam('Pedido', '');
        this.Producto = this.props.navigation.getParam('Producto', '');
        this.Cliente = this.props.navigation.getParam('Cliente', '');
        this.txtObservacion = '';
    }

    _TraerObservaciones(){
        Config.Consultar('MuestrasObservaciones/' + this.Pedido + '/' + this.Producto, (resp) => {
            resp.then(resp => resp.json())
                .then(respJson => {
                    if (respJson.Error) throw 'Hubo un error al querer traer la observación del Producto ' + this.Producto + '. Motivo: ' + respJson.Msg;
                    this.setState({Observaciones: respJson.Observacion.trim(), loading: false});
                })
                .catch((err) => console.error(err));
        });
    }

    componentDidMount(){
        this.setState({loading: true}, this._TraerObservaciones);
    }

    handleOnPress(){
        // Validamos que se tenga contenido para ser guardado.
        if (this.state.Observaciones.trim() == '') return;

        // Indicamos que vamos a comenzar con la rutina para el grabado de la Observacion
        // mostrando el spinner al costado del boton de 'Grabar'.
        this.setState({Sending: true});
        fetch(Config.BASE_URL + 'MuestrasObservaciones', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Pedido: this.Pedido,
                Producto: this.Producto,
                Observacion: this.state.Observaciones,
            })
        })
        .then(resp => resp.json())
        .then(respJson => {
            if (respJson.Error) throw 'Error al quere guardar la observacion para el producto ' + this.Producto + ' para el Pedido ' + this.Pedido;
            this.setState({Sending: false}, () => {
                this.props.navigation.goBack();
            });
        })
        .catch(err => console.log(err));
    }

    goBack = () => {
        // if (!confirm("Si sale sin grabar los cambios, estos se perderán. ¿Desea salir igualmente?")) return;
        Alert.alert('Confirmación', 'Si sale sin grabar los cambios, estos se perderán. ¿Desea salir igualmente?',
        [
            {text: 'Cancelar', onPress: () => {}},
            {text: 'Aceptar', onPress: () => this.props.navigation.goBack()},
        ]);
    };

    ContenidoBoton(){
        if (this.state.Sending) return (<Spinner color={Config.bgColorSecundario} />);
        return (<Text>Grabar</Text>);
    }
    render(){
        if (this.state.loading) return (<View><Spinner/></View>);

        return (
            <View style={{flex: 1, backgroundColor: Config.bgColorSecundario, padding: 20}}>
                <Grid >
                        <Row size={1} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Config.bgColorSecundario}}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#fff'}}>
                                OBSERVACIONES
                            </Text>
                        </Row>
                        <Row size={8} style={{paddingHorizontal: 20}}>
                            <Col>
                                <Row size={1} style={{}}>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row style={{justifyContent: 'center', alignItems: 'center'}}><Text style={[styles.WhiteText]}>Cliente</Text></Row>
                                                <Row style={{justifyContent: 'center', alignItems: 'center'}}><Text style={[styles.WhiteText]}>{this.Cliente}</Text></Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row style={{justifyContent: 'center', alignItems: 'center'}}><Text style={[styles.WhiteText]}>Producto: {this.Producto}</Text></Row>
                                            </Col>
                                            <Col>
                                                <Row style={{justifyContent: 'center', alignItems: 'center'}}><Text style={[styles.WhiteText]}>Pedido:{this.Pedido}</Text></Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row size={8} style={{justifyContent: 'center', flexDirection: 'column'}}>
                                    <Col>
                                        <Row size={1} style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 10, color: '#fff'}}>Caracteres Restantes: {200 - this.state.Observaciones.length} / 200</Text>
                                        </Row>
                                        <Row size={9}>
                                            <Textarea maxLength={200} style={{flex: 1, minHeight: 300, paddingVertical: 10 , alignItems: 'center', backgroundColor: '#fff', borderRadius: 5}} bordered placeholder="Observación..." autoFocus onChangeText={(t) => this.setState({Observaciones: t})} value={this.state.Observaciones} >
                                            </Textarea>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row size={1} style={{marginTop: 10, justifyContent: 'space-around', alignItems: 'flex-start'}}>
                                    <Col style={{paddingHorizontal: 10}}>
                                        <Button block title="" onPress={this.handleOnPress.bind(this)} disabled={this.state.Sending}>
                                            {this.ContenidoBoton()}
                                        </Button>
                                    </Col>
                                    <Col style={{paddingHorizontal: 10}}>
                                        <Button block title="" warning onPress={this.goBack}>
                                            <Text>Cancelar</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                </Grid>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    WhiteText: {
        color: '#FFF'
    },
    headerCliente: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#aaa',
    },
    codCliente: {
        fontSize: 20,
        backgroundColor: '#133c74',
        color: '#FFF',
        padding: 10
    },
    desCliente: {
        fontSize: 18,
        paddingLeft: 20,
        fontStyle: 'italic',
        color: '#FFF',
        flex: 1,
    },
    footer: {
        backgroundColor: '#d6deeb',
        padding: 10,
        flexDirection: 'row'
    },
    cuerpo: {
        flex: 1,
        minHeight: 100,
        borderColor: '#133c74',
        borderStyle: 'solid',
        borderWidth: 2,
        padding: 10,
        paddingLeft: 20,
        justifyContent: 'center'
    },
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 30
    }
});