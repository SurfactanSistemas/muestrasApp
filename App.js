import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import ListadoMuestras from './components/ListadoMuestras.js';
import DetallesPedido from './components/DetallesPedido.js';

// class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <ListadoMuestras/>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     //paddingTop: 35,
//   }
// });



export default createStackNavigator({
  Home: ListadoMuestras,
  Detalles: DetallesPedido,
});
