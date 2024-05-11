import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login'
import { displayMap } from './leaflet';

//DOM ELEMENT
const leafLet = document.getElementById("map");
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout')
// VALUES


//DELEGATION
if (leafLet){
    const locations = JSON.parse(leafLet.dataset.locations);
    displayMap(locations);

}

if (loginForm)

        loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email,password);
        
    });
if(logOutBtn) logOutBtn.addEventListener('click', logout);
