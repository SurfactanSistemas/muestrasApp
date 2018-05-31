import React from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { createStackNavigator} from 'react-navigation';
import HeaderNav from './HeaderNav.js';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Text, Textarea, Button } from 'native-base';


export default class Observacion extends React.Component {

    static navigationOptions = {
        headerTitle: <HeaderNav />,
    };

    render(){
        const Pedido = this.props.navigation.getParam('Pedido', '');
        const Producto = this.props.navigation.getParam('Producto', '');
        return (
            <View style={{flex: 1}}>
                <Grid >
                        <Row size={1}>
                            <Text>
                                Observaciones
                            </Text>
                        </Row>
                        <Row size={8}>
                            <Textarea style={{flex: 1, minHeight: 300, alignItems: 'center'}} bordered placeholder="Textarea">
                            </Textarea>
                        </Row>
                        <Row size={1} style={{justifyContent: 'space-around', alignItems: 'center'}}>
                            <Button title="" onPress={() => {}}>
                                <Text>Grabar</Text>
                            </Button>
                            <Button title="" warning onPress={() => this.props.navigation.goBack()}>
                                <Text>Cancelar</Text>
                            </Button>
                        </Row>
                </Grid>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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