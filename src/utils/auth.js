import decode from "jwt-decode";
import $ from 'jquery';
import { BASE_URL } from '../stores/server_routes.js';
import router from '/src/router/index.js';
import store from "../stores/UserStore.js";
import { disconnect } from "./hub.js";


const AUTH_TOKEN_KEY = 'token'


$.postJSON = function (url, data) {
    try {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url: BASE_URL + url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    console.log(textStatus + ": " + jqXHR.status);
                    resolve(data);
                    // store.commit('setUser', JSON.stringify(data.personal));
                    // store.commit('setUserId', data.personal.id);
                    // setAuthToken(data.token);        
                    // store.dispatch('login').then(() => {
                    //     router.push({ path: '/myProfile' });
                    // })
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown, textStatus);
                },
            });
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

export function loginUser(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = {
                email: email,
                password: password
            }
            
            var response = await $.postJSON('api/users/Authenticate', data);
            store.dispatch('login', {
                user: JSON.stringify(response.personal),
                userId: response.personal.id,
                token: response.token,
              }).then(() => {
                console.log(data)
                setAuthToken(response.token);
                //console.log("USERID: " + store.state.userId);
                router.push({ path: '/myProfile' });
                resolve(true);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export function logoutUser() {
    clearAuthToken();
    disconnect(); //from the chat message
}

export function setAuthToken(token) {
    // Set the Authorization header for all subsequent AJAX requests
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    });
    store.commit('setAuthToken', token);
}

export function getAuthTokenAuth() {
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    });
}

export function getAuthToken() {
    return store.state.auth_token;
}

export function clearAuthToken() {//Delete the token from header: https://stackoverflow.com/questions/18491368/is-there-any-way-to-remove-ajax-headers-set-by-setrequestheader
    removeAuthToken();
    localStorage.clear();
}

export function removeAuthToken() {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        delete options.headers['Authorization']
    });
}

export function isLoggedin() {
    let authToken = getAuthToken()
    return !!authToken && !isTokenExpired(authToken)
}

export function getUserInfo() {
    if (isLoggedin()) {
        return decode(getAuthToken())
    }
}

export function getAuthTokenExpirationDate(encodedToken) {
    let token = decode(encodedToken)
    if (!token.exp) {
        return null
    }

    let date = new Date(0)
    date.setUTCSeconds(token.exp)

    return date
}

function isTokenExpired(token) {
    let expirationDate = getAuthTokenExpirationDate(token)
    //console.log(expirationDate)
    return expirationDate < new Date(0) 
}