import {createStackNavigator} from 'react-navigation';
import ListadoMuestras from './components/ListadoMuestras.js';
import ListadoEstadisticas from './components/ListadoEstadisticas';
import ListadoPrecios from './components/ListadoPrecios';
import DetallesPedido from './components/DetallesPedido.js';
import DetallesVentasProductos from './components/DetallesVentasProductos';
import DetallesPreciosPorCliente from './components/DetallesPreciosPorCliente';
import DetallesPreciosVentasProductos from './components/DetallesPreciosVentasProductos';
import Observacion from './components/Observacion';
import Login from './components/Login';
import Menu from './components/Menu';

export default createStackNavigator({
  Home: Login,
  Listado: ListadoMuestras,
  Estadisticas: ListadoEstadisticas,
  Precios: ListadoPrecios,
  Detalles: DetallesPedido,
  DetallesVentasProductos: DetallesVentasProductos,
  DetallesPreciosVentasProductos: DetallesPreciosVentasProductos,
  DetallesPreciosPorCliente: DetallesPreciosPorCliente,
  Observaciones: Observacion,
  Menu: Menu
});
