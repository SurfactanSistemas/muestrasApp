import React from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView, Button, Image, Dimensions} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import Config from '../config/config.js';

export default class DetallesPedido extends React.Component{
    
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
            tamanioWidth: 0//Dimensions.get('window').width
        };
    }

    handleChangeDimensions = (dims) => {
        const value = dims.height > dims.width ? dims.width : dims.height;

        this.setState({tamanioWidth: value - 50});
    }

    componentWillMount(){
        let {width, height} = Dimensions.get('window');
        this.handleChangeDimensions({width: width, height: height});
    }

    handleOnFocus = () => {this.setState({margenInput: 350})};

    handleOnChangeText = (text) => {
        this.setState({passVendedor: text, msgError: ''})};

    handleOnPress = async () => {
        this.setState({showError: false, msgError: ''});
        Config.Consultar('/login/' + this.state.passVendedor, (resp) => {
            resp.then((res) => res.json())
                .then((res) => {
                    if (res != -1){
                        this.props.navigation.navigate('Listado', {idVendedor: res});
                    }else{ this.setState({showError: true, msgError: 'La clave indicada no es una cláve válida. Vuela a intentar.'}); }
                })
                .catch((err) => {
                    this.setState({showError: true, msgError: err});
                });
        });
    };

    render(){
        
        return (
            <ScrollView contentContainerStyle= {{flexGrow: 1}} style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 50}}>
                        <Image source = {require('../assets/img/surfaclogo.png')} />
                        <Text style={{color: '#fff', fontSize: 25}}>SURFACTAN S.A</Text>
                    </View>
                    
                    <View style = {{margin: 20}}>
                        <Text style={[styles.titleHeader]}>Inicio de Sesión</Text>
                    </View>
                    
                    <View style={[styles.loginFormContainer]}>
                        <TextInput placeholder = 'Contraseña...' secureTextEntry={true} underlineColorAndroid = 'transparent' style={[styles.InputText, {width: this.state.tamanioWidth}]} onChangeText = {this.handleOnChangeText} />
                    </View>
                    
                    <View style = {{width: this.state.tamanioWidth}}>
                        <Button style={[styles.ButtonForm]} title = 'Iniciar Sesión ' onPress = {this.handleOnPress} />
                    </View>

                    <View style = {{width: this.state.tamanioWidth}}>
                        <Text style= {{color: 'yellow', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>{this.state.msgError}</Text>
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Config.bgColor
    },
    titleHeader: {
        color: '#fff',
        // fontWeight: 'bold',
        fontSize: 20
    },
    InputText: {
        color: '#ccc',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 20,
        minWidth: 250,
        textAlign: 'center'
    },
    ButtonForm: {
        margin: 20
    },
    loginFormContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});