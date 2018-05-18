import React from 'react';
import {StyleSheet, Text, Image, View, Linking, ScrollView} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import ItemListado from './ItemListado.js'
import Header from './Header.js';
import HeaderNav from './HeaderNav.js';

export default class DetallesPedido extends React.Component{
    
    static navigationOptions = {
        headerTitle: <HeaderNav />,
    };

    
        //headerRight: <Button title="Info" color="#fff" />

    state = {
        datos: [],
        refrescando : false,
        ultimo: 0,
        urlConsulta: ''
    }

    componentDidMount(){
        return this._ReGenerarItems();
    }

    ConsultarUrlConsulta() {
        return fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({urlConsulta: responseJson[0].url + '/detalle/' + this.props.navigation.getParam('Pedido', '0')});
                    })
    }

    _ReGenerarItems(){
        this.setState({refrescando: true});
        return this.ConsultarUrlConsulta()
                    .then(() => {
                        return fetch(this.state.urlConsulta)
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    this.setState({
                                        refrescando: false,
                                        datos: responseJson
                                    });
                                })
                                .catch((error) => console.error(error));
                    })
                    .catch((error) => console.error(error));
        this.setState({datos, refrescando: false});        
    }

    _KeyExtractor = (item, index) => index + '';

    Row(texto, contenido, _fontSize = 20){
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <Text style={{fontSize: _fontSize, flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5 + Math.ceil((20 - _fontSize)/2)}}>{texto} </Text><Text style={{textAlign: 'left', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#eee', fontSize: 20, flex: 3, fontStyle: 'italic'}}>{contenido}</Text>
            </View>
        );
    }

    render(){
        if (!this.state.refrescando && this.state.datos.length > 0){
            return (
                <ScrollView>
                    <View style = {styles.container}>
                        {this.Row('Cliente:', this.state.datos[0].Razon)}
                        {this.Row('Cod Cliente:', this.state.datos[0].Cliente, 15)}
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, backgroundColor: '#eee'}}>
                            <Text style={{flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5}}>
                                Pedido
                            </Text>
                            <Text style={{flex: 2, paddingLeft: 10, fontStyle: 'italic'}}>
                                {this.state.datos[0].Pedido}
                            </Text>
                            <Text  style={{flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5}}>
                                Muestra
                            </Text>
                            <Text  style={{flex: 2, paddingLeft: 10, fontStyle: 'italic'}}>
                                {this.state.datos[0].Muestra}
                            </Text>
                        </View>
                        
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, backgroundColor: '#eee'}}>
                            <Text style={{flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5}}>
                                Fecha Pedido
                            </Text>
                            <Text style={{flex: 3, paddingLeft: 10, fontStyle: 'italic'}}>
                                {this.state.datos[0].Fecha}
                            </Text>
                        </View>

                        <View style={{backgroundColor: '#133c74', alignItems: 'center'}}>
                            <Text style={{color: 'white', margin: 5, fontSize: 15}}>
                                Dirección de Entrega
                            </Text>
                        </View>

                        <View style={{marginBottom: 10, backgroundColor: '#eee', alignItems: 'center'}}>
                            <Text style={{fontStyle: 'italic', margin: 20}} onPress = {() => Linking.openURL("https://www.google.com.ar/maps/search/" + this.state.datos[0].DireccionEntrega.replace(' ', '+') + '/' ).catch(err => console.error(err)) }>
                                {this.state.datos[0].DireccionEntrega}
                            </Text>
                        </View>

                        <View style={{backgroundColor: '#133c74', alignItems: 'center'}}>
                            <Text style={{color: 'white', margin: 5, fontSize: 15}}>
                                Items
                            </Text>
                        </View>
                        <View style={{borderColor: '#ddd', borderStyle: 'solid', borderWidth: 2}}>
                            {
                                this.state.datos[0].Productos.map(item =>{
                                return (
                                        <View key = {item.Producto} style={{alignItems: 'center', flexDirection: 'row', margin: 10}}>
                                            <Text style={{flex: 2, fontSize: 13}}>{item.Producto}</Text>
                                            <Text style={{flex: 4}}>{item.DesProducto}</Text>
                                            <Text style={{flex: 1, textAlign: 'right', fontSize: 12}}>{parseFloat(item.Cantidad).toFixed(2)} Kgs</Text>
                                        </View>
                                    )
                            })}
                        </View>
                        
                        <View style={{backgroundColor: '#133c74', alignItems: 'center', marginTop: 10}}>
                            <Text style={{color: 'white', margin: 5, fontSize: 15}}>
                                Observaciones
                            </Text>
                        </View>
                        <View style={{ backgroundColor: '#eee', alignItems: 'center'}}>
                            <Text style={{fontStyle: 'italic', margin: 20}}>
                                {this.state.datos[0].Observaciones}
                            </Text>
                        </View>

                        {this.Row('Vendedor', this.state.datos[0].DesVendedor)}

                    </View>
                </ScrollView>
            )
        }else{
            return (
                <View style = {styles.container}>
                    
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    }
});