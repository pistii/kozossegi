import $, { error } from 'jquery'
import store from '@/stores/config.js';
import { ref } from "vue";
import UserStore from './UserStore.js';
import { getAuthToken } from '@/utils/auth';

//import auth from '../utils/auth.js'
//https://vuex.vuejs.org/guide/getters.html#method-style-access

const BASE_URL = "http://localhost:5000/"
const AUTH_TOKEN_KEY = UserStore.state.auth_token;

export default{
	data() {
		return {
			getAuthToken,
			
		}
	},
	methods: {
		async fetchData(method, path, requestData = null, param1 = null, param2 = null, param3 = null) {
			const route = store.getters.getServerRoute(path); //pl getObject, és ahol a path egyezik, az alapján valósítani meg az auth, és kérelmeket.
			
			if (!route) {
				console.error("Invalid route name:" + path); //TODO: Későbbi megfelelő hibakezelés... pl 404 page
				return;
			}
			//console.log(param1, param2)

			const request = async (method, path, data, parameter1 = null, parameter2 = null, parameter3 = null) => {
				let url = BASE_URL + path;
				// console.log("URL: " + url)
				// console.log("PATH: " + path)
				// console.log("RequestData: " + data)
				// console.log("param1: " + parameter1)
				// console.log("param2: " + parameter2)

				if (parameter1 != null) {
				  url += parameter1;
				  //console.log("paraméter1");
				  if (parameter2 !== null) {
					url += "/" + parameter2;
					//console.log("paraméter2");
					if (parameter3 !== null) {
						console.log("paraméter3");
						url += "/" + parameter3;
					  }
				  }
				  console.log(url)
				}
				
				let headers = {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				};
				
				if (path !== 'api/users/Signup/' && !path.includes("api/users/ForgotPw/") && !path.includes("checkVerCode")) {
					console.log(path)
					headers['Authorization'] = 'Bearer ' + AUTH_TOKEN_KEY 
				}
				console.log(headers)

				try {
					return new Promise((resolve, reject) => {
						$.ajax({
						  headers: headers,
						  url: url,
						  type: method,
						  data: JSON.stringify(data),
						  dataType: "JSON",
						  success: function (responseData, textStatus, jqXHR) {
							resolve(responseData);
						  },
						  error: function (jqXHR, textStatus, errorThrown) {
							console.log(errorThrown, 'status: ' + textStatus, "errorThrown: " + errorThrown);
							reject(textStatus, jqXHR.status, errorThrown);
						  },
						});
					  });
				} catch (error) {
				  console.error('Error:', error);
				  throw error;
				}
			  };

			const Get = (parameter1 = null, parameter2 = null, parameter3 = null) => {
				return request('GET', route, null, parameter1, parameter2, parameter3);
			};
			const Post = () => {
				return request('POST', route, requestData)
			};
			const Put = (param1 = null, param2 = null) => {
				return request('PUT', route, requestData, param1, param2)
			}
			const Delete = (param1 = null) => {
				return request('DELETE', route, requestData, param1)
			}

			if (method === 'GET') {
				return await Get(param1, param2, param3);
			}
			else if (method === 'POST') {
				return await Post();
			}
			else if (method === 'PUT') {
				return await Put(param1, param2);
			}
			else if (method === 'DELETE') {
				return await Delete(param1);
			}
		}
	}
}

export async function PostImage(method, path, formData, param1 = null) {
	const route = store.getters.getServerRoute(path);
			
	if (!route) {
		console.error("Invalid route name:" + path); 
		return;
	}
	return new Promise((resolve, reject) => {
		$.ajax({
			type: method,
			url: param1 != null ? BASE_URL + route + param1 : BASE_URL + route, 
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data)
			{
				//console.log("success");
				resolve(data);
				console.log(data);
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				reject(textStatus)
				console.log('URL: ' +  param1 != null ? BASE_URL + route + param1 : BASE_URL + route)
				console.log("error: " + jqXHR + "; " + textStatus + "; " + errorThrown);
				//console.log(data);
			}
		});
	});
}

export { BASE_URL }
