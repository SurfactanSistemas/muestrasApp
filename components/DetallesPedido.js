import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import HeaderNav from './HeaderNav.js';
import { Container, Content, List, Badge } from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Config from '../config/config';

export default class DetallesPedido extends React.PureComponent{
	
	static navigationOptions = {
		headerTitle: <HeaderNav />,
	};

	state = {
		datos: this.props.navigation.getParam('Cliente', undefined),
		refrescando : false,
		ultimo: 0,
		urlConsulta: ''
	}

	_KeyExtractor = (item, index) => index + '';

	Row(texto, contenido, _fontSize = 20){
		return (
			<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
				<Text style={{fontSize: _fontSize, flex: 1, backgroundColor: '#133c74', color: 'white', paddingLeft: 10, paddingVertical: 5 + Math.ceil((20 - _fontSize)/2)}}>{texto} </Text><Text style={{textAlign: 'left', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#eee', fontSize: 20, flex: 3, fontStyle: 'italic'}}>{contenido}</Text>
			</View>
		);
	}

	RenderEstado(WRemito) {
		return (
			<Col size={1} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: (WRemito.trim() != 0 ? 'green' : 'red')}}>
				<Text style={{color: '#fff', paddingHorizontal: 5}}>{(WRemito.trim() != 0 ? 'Enviado' : 'No Enviado')}</Text>
			</Col>
		);
	}

	render(){
		if (this.state.datos){
			let Cliente = this.state.datos;
			
			return (
				<Container>
					<Content contentContainerStyle={{flex: 1, backgroundColor: '#fff'}}>
						<Grid>
							<Row size={1}>
								<Col style={{backgroundColor: Config.bgColorSecundario}}>
									<Row style={{alignItems: 'center', justifyContent: 'center', padding: 10}}>
										<Text style={{fontWeight: 'bold', color: '#fff', fontSize: 25, textAlign: 'center'}}>{Cliente.Razon}</Text>
									</Row>
									<Row style={{alignItems: 'center', justifyContent: 'center'}}>
										<Text style={{fontStyle: 'italic', color: '#fff', fontSize: 15}}>{Cliente.Datos[0].Datos[0].DesVendedor}</Text>
									</Row>
								</Col>
							</Row>
							<Row size={6}>
								<Col>
									<List
										dataArray={Cliente.Datos}
										renderRow={(Pedido) => {
											let Productos = [];
											Pedido.Datos.map((dato) => Productos.push({Codigo: dato.Producto, Descripcion: dato.DesProducto , Cantidad: Config.NormalizarNumero(dato.Cantidad)}) );
											let Fecha = Pedido.Datos[0].Fecha;
											let Remito = Pedido.Datos[0].Remito;
											return (
												<Col>
													
														
														{/* Encabezado */}
														<Row size={1} style={{backgroundColor: Config.bgColorTerciario, height: 60, marginTop: 20,  borderTopColor: '#eee', borderTopWidth: 2, borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}> Nro. Pedido:</Text>
															</Col>
															<Col size={2} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
																<Text>{Pedido.Pedido}</Text>
															</Col>
														</Row>
														<Row size={1} style={{backgroundColor: Config.bgColorTerciario, height: 40, borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Col size={2} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Estado:</Text>
															</Col>
															{ this.RenderEstado(Remito) }
															<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																<Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Fecha:</Text>
															</Col>
															<Col size={2} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
																<Text>{Fecha}</Text>
															</Col>
														</Row>
														
														<Row size={1} style={{backgroundColor: Config.bgColorSecundario, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#eee', borderBottomWidth: 2}}>
															<Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15, fontStyle: 'italic', marginVertical: 10}}>
																Items
															</Text>
														</Row>
														<Row size={2}>
															{/* Listado de Items */}
															<Col>
																<Row style={{backgroundColor: Config.bgColorTerciario, paddingVertical: 10}}>
																	<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold'}}>Codigo</Text>
																	</Col>
																	<Col size={3} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold'}}>Descripción</Text>
																	</Col>
																	<Col size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
																		<Text style={{fontSize: 15, color: '#fff', fontWeight: 'bold'}}>Cantidad (Kgs)</Text>
																	</Col>
																</Row>
																{Productos.map((producto) => {
																	const DatosClienteObservaciones = {
																		Pedido: Pedido.Pedido,
																		Producto: producto.Codigo,
																		Cliente: Cliente.Razon
																	};

																	return (
																		<TouchableHighlight  key={producto.Codigo} onPress={() => {this.props.navigation.navigate('Observaciones', DatosClienteObservaciones)}}>
																			<Row key={producto.Codigo} style={{backgroundColor: '#eee', padding: 10, borderBottomColor: '#aaa', borderBottomWidth: 1}}>
																				<Col size={1} style={{minWidth: 30}}>
																					<Text style={{fontSize: 12}}>({producto.Codigo})</Text>
																				</Col>
																				<Col size={3} style={{paddingLeft: 10}}>
																					<Text>{producto.Descripcion}</Text>
																				</Col>
																				<Col size={1}>
																					<Text style={{textAlign: 'right', paddingRight: 5}}>{producto.Cantidad}</Text>
																				</Col>
																			</Row>
																		</TouchableHighlight>
																	)
																})}
																<Row style={{borderBottomColor: '#ccc', borderBottomWidth: 1, marginTop: 20, marginHorizontal: 60 }}></Row>
															</Col>
														</Row>

												</Col>
											)
										}}
									>

									</List>
								</Col>
							</Row>
						</Grid>
					</Content>
				</Container>
			)
		}
	}
}