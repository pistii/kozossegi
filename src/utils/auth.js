import decode from "jwt-decode";
import $ from 'jquery';
import { BASE_URL } from '../stores/server_routes.js';
import router from '/src/router/index.js';

const AUTH_TOKEN_KEY = 'token'

$.postJSON = function (url, data, callback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data, textStatus, jqXHR) {
            //console.log(textStatus + ": " + jqXHR.status);
            localStorage.setItem('userInfo', JSON.stringify(data.personal))            
            //console.log(localStorage.getItem('userInfo'))
            setAuthToken(data.token);
            router.push({ path: '/myProfile' })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
        },
        'type': 'POST',
        'url': BASE_URL + url,
        'data': JSON.stringify(data),
        'dataType': 'json'
    });
}


export function loginUser(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = {
                email: email,
                password: password
            }
            $.postJSON('/users/Authenticate', data, "");
            resolve();
        }
        catch (err) {
            console.log(err);
            reject();
        }
    });
}

export function logoutUser() {
    clearAuthToken();
}

export function setAuthToken(token) {
    $.postJSON({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + data);
        }
    });
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {//Delete the token from header: https://stackoverflow.com/questions/18491368/is-there-any-way-to-remove-ajax-headers-set-by-setrequestheader
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        //delete options.headers['custom-xid-header'];
        delete options.headers['Authorization']
        localStorage.removeItem(token);
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
    return expirationDate < new Date(0)
}