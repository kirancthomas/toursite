import axios from 'axios';
import { showAlert } from './alerts.js';

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:4000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
                },
      });
  
            if (res.data.satus  || res.data.status === 'success') 
                {
                showAlert('success', 'Account created successfully');
                window.setTimeout(() => {
                location.assign('http://127.0.0.1:4000/');
                }, 1500);
                
            }

    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };