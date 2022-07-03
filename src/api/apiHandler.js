
import axios from 'axios';
import conf from './conf.json';


// Get current users profile
export const authUser = async (token) => {
    let bearer = "Bearer "+token;
    const config = {
        headers: { 
            "Authorization": bearer
        }
    };
    let response;
    try {
        const res  = await axios.get(
            conf.base_url+'/auth/user',
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