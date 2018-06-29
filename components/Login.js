import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import Config from '../config/config.js';
import { Container, Text, Content, Form, Item, Input, Label, Icon, Button, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

const MSG_CLAVE_ERRONEA = 'La clave indicada no es una cláve válida. Vuela a intentar.';

export default class DetallesPedido extends React.PureComponent{
    
    static navigationOptions = {
        headerStyle: {
            backgroundColor: Config.bgColor,
        },
    };

    constructor(props){
        super(props);

        this.state = {
            urlConsulta: '',
            margenInput: 0,
            passVendedor: '',
            showError: false,
            msgError: '',
            tamanioWidth: 0, //Dimensions.get('window').width,
            fontLoaded: true,
            Sending: false
        };
    }

    handleChangeDimensions = (dims) => {
        const value = dims.height > dims.width ? dims.width : dims.height;

        this.setState({tamanioWidth: value - 50});
    }

    async componentWillMount(){
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });

        this.setState({fontLoaded: false});

        let {width, height} = Dimensions.get('window');
        this.handleChangeDimensions({width: width, height: height});
    }

    handleOnChangeText = (text) => {
        this.setState({passVendedor: text, msgError: ''})};

    handleOnPress = async () => {
        this.setState({showError: false, msgError: '', Sending: true});

        let Clave = this.state.passVendedor;

        if (Clave == "") Clave = "carrozzo10";

        Config.Consultar('login/' + Clave, (resp) => {
            resp.then(res => res.json())
                .then((resJson) => {
                    if (resJson.length == 0) {
                        this.txtInput._root.clear();
                        throw MSG_CLAVE_ERRONEA;
                    }
                    let _idVendedor = resJson[0].Table[0].Vendedor;

                    if (_idVendedor > 0){
                        this.setState({Sending: false}, () => {
                            this.props.navigation.navigate('Menu', {idVendedor: _idVendedor});
                        });
                    }else{
                        this.txtInput._root.clear();
                        this.setState({showError: true, msgError: MSG_CLAVE_ERRONEA, Sending: false});
                    }
                })
                .catch((err) => {
                    this.setState({showError: true, msgError: err, Sending: false});
                    this.txtInput._root.clear();
                });
        });
    };

    textoBoton(){
        if (!this.state.Sending) return (<Text style={{color: '#fff'}}>Iniciar Sesión</Text>);
        return (<Spinner color={Config.bgColor}/>);
    }
    render(){
        if (this.state.fontLoaded){
            return ( <Spinner /> )
        }
        return (
            <Container>
                <Content contentContainerStyle= {{flexGrow: 1}} style={styles.container}>
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}> 
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 50}}>
                            <Image source = {require('../assets/img/surfaclogo.png')} />
                            <Text style={{color: '#fff', fontSize: 25}}>SURFACTAN S.A</Text>
                        </View>
                    
                        <View style = {{margin: 20}}>
                            <Text style={[styles.titleHeader]}>Inicio de Sesión</Text>
                        </View>
                    </View>

                    <Grid>
                        <Col>
                            <Form style={styles.loginFormContainer}>
                                <Row>
                                    <Item floatingLabel last style={{flex: 1}}>
                                        <Icon active name='key' style={styles.loginFormIconInput}/>
                                        <Label style={{color: '#fff', marginLeft: 5}}>Contraseña...</Label>
                                        <Input getRef={i => this.txtInput = i} secureTextEntry={true} style={[styles.InputText, {width: this.state.tamanioWidth}]}
                                            onChangeText={this.handleOnChangeText}
                                            onSubmitEditing={this.handleOnPress}
                                        />
                                    </Item>
                                </Row>
                                <Row style={{justifyContent: 'center'}}>
                                    <Button block style={{ flex: 1, marginTop: 15}} onPress={this.handleOnPress} disabled={this.state.Sending}>
                                        {this.textoBoton()}
                                    </Button>
                                </Row>
                            </Form>                            
                        </Col>
                    </Grid>                    
                    <View>
                        <Text style={{color: 'yellow', fontSize: 15, textAlign: 'center'}}>{this.state.msgError}</Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Config.bgColor,
        paddingLeft: 30,
        paddingRight: 30
    },
    titleHeader: {
        color: '#fff',
        fontSize: 20
    },
    InputText: {
        color: '#ccc',
        padding: 10,
        marginBottom: 2,
    },
    ButtonForm: {
        margin: 20
    },
    loginFormContainer: {
        paddingLeft: 30,
        paddingRight: 30
    },
    loginFormIconInput: {
        color: '#fff',
        marginRight: 5
    },
    loginFormIconInputRemove: {
        color: '#fff'
    }
});