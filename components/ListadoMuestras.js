import React from 'react';
import {StyleSheet, Text, Image, View, FlatList, Button} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import ItemListado from './ItemListado.js'
import Header from './Header.js';
import HeaderNav from './HeaderNav.js';

export default class ListadoMuestras extends React.Component{
    
    static navigationOptions = {
        headerTitle: <HeaderNav />
    };

    state = {
        datos: [],
        refrescando : false,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: this.props.navigation.getParam('idVendedor', -1)
    }

    componentDidMount(){
        //this.setState({idVendedor: this.props.navigation.getParam('idVendedor', -1)});
        return this._ReGenerarItems();
    }

    ConsultarUrlConsulta() {
        return fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({urlConsulta: responseJson[0].url + '/todas/' + this.state.idVendedor});
                    })
    }

    _ReGenerarItems(){

        if (this.state.idVendedor == -1) return;

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

    _KeyExtractor = (item, index) => item.Pedido + '';

    render(){
        return (
            <View style = {styles.container}>
                <FlatList
                    data = {this.state.datos}
                    refreshing = {this.state.refrescando}
                    onRefresh = {() => this._ReGenerarItems()}
                    ListHeaderComponent = {<Header />}
                    stickyHeaderIndices = {[0]}
                    renderItem = {({item}) => <ItemListado item={item} nav = {this.props.navigation}/>}
                    keyExtractor = {this._KeyExtractor}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#d6deeb'
    }
});