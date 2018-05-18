import React from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';

export default class HeaderNav extends React.Component {
    render(){
        return (
            <View style={styles.header}>
                <Image style = {{height: 50, width: 75}} source={require('../assets/img/surfaclogo.png')} />
                <Text style={styles.titulo}>SURFACTAN S.A.</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    titulo: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FFF',
        flex: 1,
        textAlign: 'center'
    },
    header: {
        backgroundColor: '#133c74',
        padding: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        //marginTop: 65
    }
});