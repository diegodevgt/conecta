import React from 'react';
const CreacionPedido = React.lazy(() => import('./views/pedido/CreacionPedido'));
const Profile = React.lazy(() => import('./views/pages/account/Profile'))
const NewPassword = React.lazy(() => import('./views/pages/account/NewPassword'))
const Recibos = React.lazy(() => import('./views/pages/account/Recibos'))
const MisEnvios = React.lazy(() => import('./views/pages/dashboard/MisEnvios'))
const Cupones = React.lazy(() => import('./views/pages/dashboard/Cupones'))
const PlanesDisponibles = React.lazy(() => import('./views/pages/planes/Planes'))
const Coberturas = React.lazy(() => import('./views/pages/dashboard/Coberturas'))
const Recomendaciones = React.lazy(() => import('./views/pages/dashboard/Recomendaciones'))
const CrossSelling = React.lazy(() => import('./views/pages/dashboard/CrossSelling'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  // Conecta
  { path: '/cuenta/perfil', name: 'Cuenta', component: Profile },
  { path: '/cuenta/password', name: 'Contraseña', component: NewPassword },
  { path: '/cuenta/recibos', name: 'Recibos', component: Recibos },
  { path: '/creacion-pedido', name: 'Creacion de Pedido', component: CreacionPedido },
  { path: '/mis-envios', name: 'Mis Envios', component: MisEnvios },
  { path: '/mis-cupones', name: 'Mis Cupones', component: Cupones },
  { path: '/planes-disponibles', name: 'Planes Disponibles', component: PlanesDisponibles },
  { path: '/coberturas', name: 'Coberturas', component: Coberturas },
  { path: '/recomendaciones', name: 'Recomendaciones', component: Recomendaciones },
  { path: '/cross-selling', name: 'Cross Selling', component: CrossSelling },
];

export default routes;
