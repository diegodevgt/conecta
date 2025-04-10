/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';
import { authUser } from '../api/apiHandler'
import { useToasts } from 'react-toast-notifications';

const TheHeaderDropdown = () => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { addToast } = useToasts();

  useEffect(() => {
    const fetchUserData = async () => {
      const user_object = reactLocalStorage.getObject('user');
  
      if (!user_object || Object.keys(user_object).length === 0) {
        setUser({});
        history.push('/login');
        addToast("Sesión terminada", {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 3000
        });
      } else if (!('name' in user_object)) {
        const data_api = await authUser(user_object.token);
  
        if (data_api.valid) {
          const updatedUser = {
            ...user_object,
            name: data_api.response.data.name,
          };
          setUser(updatedUser);
          reactLocalStorage.setObject('user', updatedUser);
        } else {
          reactLocalStorage.remove('user');
          setUser({});
          addToast("Sesión terminada", {
            appearance: 'error',
            autoDismiss: true,
            autoDismissTimeout: 3000
          });
          history.push('/login');
        }
      } else {
        setUser({ ...user_object });
      }
    };
  
    fetchUserData();
  }, [addToast, history]);  
  
  useEffect(() => {
    if ('name' in user) {
      setLoading(true);
    }
  }, [user])



  return (
    (loading) ?
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CIcon
              name="cil-user"
              customClasses="user-icon-header"
            />
          </div>
          <div className="username-conecta-header">
            {user.name.substring(0, 7)}
          </div>
          <CIcon
            style={{ color: '#91b515 !important' }}
            name="cil-chevron-bottom"
            customClasses="drop-icon-header"
          />

        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>Cuenta</strong>
          </CDropdownItem>
          <CDropdownItem onClick={() => {
            history.push('/cuenta/perfil');
          }}>
            <CIcon name="cil-user" className="mfe-2" />Perfil
          </CDropdownItem>
          <CDropdownItem onClick={() => {
            history.push('/cuenta/password');
          }}>
            <CIcon name="cil-settings" className="mfe-2" />
            Cambio de Contraseña
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem onClick={() => {
            if ('token' in user) {
              reactLocalStorage.remove('user');
              history.push('/');
            }
          }}>
            <CIcon name="cil-lock-locked" className="mfe-2" />
            Salir
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      : null
  )
}

export default TheHeaderDropdown
