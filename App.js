import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import ListadoMuestras from './components/ListadoMuestras.js';
import DetallesPedido from './components/DetallesPedido.js';
import Login from './components/Login';



export default createStackNavigator({
  Home: Login,
  Listado: ListadoMuestras,
  Detalles: DetallesPedido,
});
