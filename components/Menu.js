import React from 'react';
import { View } from 'react-native';
import HeaderNav from './HeaderNav.js';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Text, Button, Spinner } from 'native-base';
import Config from '../config/config';

export default class Menu extends React.PureComponent {

    static navigationOptions = {
        headerTitle: <HeaderNav />,
    };

    constructor(props){
        super(props);
        this.state = {
            Observaciones: '',
            loading: false,
            idVendedor: this.props.navigation.getParam('idVendedor', -1)
        };
        this.Limite = 12;

        this.Items = [
            {
                Texto: 'Muestras',
                Ruta: 'Listado'
            },
            {
                Texto: 'Ventas por Cliente',
                Ruta: 'Estadisticas'
            },
            {
                Texto: 'Precios por Cliente',
                Ruta: 'Precios'
            },
            {
                Texto: 'Cerrar Sesión',
                Ruta: 'Home'
            }
        ];
    }

    componentDidMount(){}

    GenerarItem(item, index){
        return (
            <Row key={index} size={1} style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <Button block onPress={() => {
                    this.props.navigation.navigate(item.Ruta, {idVendedor: this.state.idVendedor});
                }} style={{flex: 1}}>
                    <Text style={{flex: 1, color: '#fff', textAlign: 'center'}}>{item.Texto}</Text>
                </Button>
            </Row>
        );
    }
    handleOnPress(){}

    goBack = () => {
        this.props.navigation.goBack();
    }

    render(){
        if (this.state.loading) return (<View><Spinner/></View>);

        return (
            <View style={{flex: 1, backgroundColor: Config.bgColorSecundario, padding: 20}}>
                <Grid >
                    <Col>
                        <Row size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: 40}}>
                                Menú
                            </Text>
                        </Row>
                        <Row size={11}>
                            <Col>
                                {this.Items.map((item, index) =>{
                                    return this.GenerarItem(item, index);
                                })}
                                <Row size={12 - this.Items.length}></Row>
                            </Col>
                        </Row>
                    </Col>
                </Grid>
            </View>
        )
    }
}