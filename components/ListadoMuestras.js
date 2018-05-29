import React from 'react';
import {StyleSheet, Image, View, FlatList, Button} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import ItemListado from './ItemListado.js'
import Header from './Header.js';
import HeaderNav from './HeaderNav.js';
import { Container, Text, Content, List, ListItem, Separator, Spinner, Icon } from 'native-base';
import Config from '../config/config.js'
import _ from 'lodash';

export default class ListadoMuestras extends React.Component{
    
    static navigationOptions = {
        headerTitle: <HeaderNav />,
        headerRight: <Icon name="md-refresh"/>
    };

    state = {
        datos: [],
        refrescando : true,
        ultimo: 0,
        urlConsulta: '',
        idVendedor: this.props.navigation.getParam('idVendedor', -1)
    }

    componentDidMount(){
        //this.setState({idVendedor: this.props.navigation.getParam('idVendedor', -1)});
        return this._ReGenerarItems();
        this.setState({refrescando: false});
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
        return Config.Consultar('Muestras/' + this.state.idVendedor, (resp) => {
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

                    this.setState({
                        refrescando: false,
                        datos: _datos
                    });

                })
                .catch((error) => console.error(error));
        });

        this.setState({refrescando: false});
    }

    _KeyExtractor = (item, index) => item.Pedido + '';

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
                <Content>
                    <List
                        dataArray={this.state.datos}
                        renderRow={(item) => {
                            return (
                                <View key={item.Vendedor}>
                                    <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center'}}>
                                        <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>{item.DesVendedor}</Text>
                                    </ListItem>
                                    <List
                                        dataArray={item.Datos}
                                        renderRow={(itemCliente) => {
                                           return (
                                                <ListItem key={itemCliente.Cliente}>
                                                    <Text>

                                                        <Text style={{fontSize: 10, fontStyle: 'italic'}}>

                                                            ({itemCliente.Cliente})

                                                        </Text>

                                                        {itemCliente.Razon}

                                                    </Text>
                                                </ListItem>
                                           ) 
                                        }}>
                                        
                                    </List>
                                </View>
                            )
                        }}
                    >

                    </List>
                    {/* <List>
                        {this.state.datos.map((item) => {
                            
                            return (
                                <View key={item.Vendedor}>
                                    <ListItem itemHeader key={item.Vendedor} style={{backgroundColor: Config.bgColorSecundario, minHeight: 70}}>
                                        <Text style={{color: '#fff', fontSize: 20}}>{item.Vendedor}</Text>
                                    </ListItem>
                                    <List>
                                        {item.datos.map((cliente) => {
                                            return (
                                                <ListItem key={cliente.Cliente}>
                                                    <Text>{cliente.Cliente}</Text>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </View>
                            )
                        })}
                    </List> */}
                </Content>
            </Container>
            // <View style = {styles.container}>
            //     <FlatList
            //         data = {this.state.datos}
            //         refreshing = {this.state.refrescando}
            //         onRefresh = {() => this._ReGenerarItems()}
            //         ListHeaderComponent = {<Header />}
            //         stickyHeaderIndices = {[0]}
            //         renderItem = {({item}) => <ItemListado item={item} nav = {this.props.navigation}/>}
            //         keyExtractor = {this._KeyExtractor}
            //     />
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#d6deeb'
    }
});