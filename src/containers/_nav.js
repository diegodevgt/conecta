import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Nuevo Pedido',
    to: '/creacion-pedido',
    icon: 'cil-list',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mis envíos',
    to: '/mis-envios',
    icon: 'cil-envelope-closed',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Saldo Prepago',
    to: 'saldo-prepago',
    icon: 'cil-credit-card'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Carga Masiva',
    to: 'pedidos-excel',
    icon: 'cil-credit-card'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mis Cupones',
    to: '/mis-cupones',
    icon: 'cil-credit-card',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Planes disponibles',
    to: '/planes-disponibles',
    icon: 'cil-paper-plane',
  },
  {
    _tag: 'CSidebarNavItem',
    name: <>Cross Selling &nbsp;	<span style={{ backgroundColor: '#ffc600', fontWeight: '500', color: 'black', paddingLeft: '3px', paddingRight: '3px' }}> PREMIUM </span></>,
    to: '/cross-selling',
    icon: 'cil-bell',
  },
  {
    _tag: 'CSidebarNavDropdown',
    className: 'c-sidebar-nav-arrow-dropdown',
    name: <>Cuenta <CIcon id="icon-arrow" style={{ color: '#91b515 !important' }} name="cil-chevron-bottom" customClasses="c-sidebar-nav-icon" /></>,
    to: '/cuenta',
    icon: 'cil-user',
    badge: {
      color: 'info',
      text: 'NEW',
    },
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: '- Perfil',
        to: '/cuenta/perfil',
      },
      {
        _tag: 'CSidebarNavItem',
        name: '- Cambio de contraseña',
        to: '/cuenta/password',
      }
    ]
  }
]

export default _nav
