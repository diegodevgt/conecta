
import axios from 'axios';
import conf from './conf.json';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useHistory } from "react-router-dom";
// Get current users profile
export const authUser = async (token) => {
    let bearer = "Bearer " + token;
    const config = {
        headers: {
            "Authorization": bearer
        }
    };
    let response;
    try {
        const res = await axios.get(
            conf.base_url + '/auth/user',
            config
        );
        response = {
            valid: true,
            response: res
        };
    } catch (err) {
        response = {
            valid: false,
            response: err
        };
    }
    return response;
};


export const loginUser = async (data) => {
    let response;
    // const headers = {"Access-Control-Allow-Origin": "*"};

    try {

        const res = await axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/auth/login',
            data: data,
        });

        // const res  = await axios.post(
        //     conf.base_url+'/auth/login',
        //     data,
        //     // headers
        // );
        response = {
            valid: true,
            response: res
        };
    } catch (err) {
        response = {
            valid: false,
            response: err
        };
    }
    return response;
};

// export const verificado = async () => {
//     const history = useHistory();
//     const user_object = reactLocalStorage.getObject('user');
//     let bearer = "";

//     if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
//         reactLocalStorage.remove('user');
//         return null;
//     } else {
//         bearer = `Bearer ${user_object.token}`;
//     }

//     const config = {
//         headers: {
//             "Authorization": bearer
//         }
//     };

//     axios.get(
//         'https://ws.conectaguate.com/api/v1/site/verificado',
//         config
//     ).then(async (response) => {
//         console.log("response", response.data.verificacion);
//         history.push('/ConfirmacionUsuario');
//         return response.data.verificacion;
//     });
// }