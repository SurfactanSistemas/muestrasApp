import React from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';

export default class HeaderNav extends React.PureComponent {

    static defaultProps = {
        section: null
    }

    constructor(props){
        super(props);
    }

    tituloSecundario = () => (
        <Text style={styles.tituloSecundario}>
            {this.props.section}
        </Text>
    )

    render(){
        return (
            <View style={[styles.header, {flexDirection: 'row', flex: 1, justifyContent: 'space-around'}]}>
                <Image style = {{height: 50, width: 75}} source={require('../assets/img/surfaclogo.png')} />
                <View>
                    <Text style={styles.titulo}>
                        SURFACTAN S.A.
                    </Text>
                    {this.tituloSecundario()}
                </View>
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
    tituloSecundario: {
        // fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF',
        flex: 1,
        textAlign: 'center'
    },
    header: {
        backgroundColor: '#133c74',
        // padding: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
});