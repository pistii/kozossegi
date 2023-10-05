import { mapGetters } from "vuex";
import $ from 'jquery'
import store from '../stores/config.js';
//https://vuex.vuejs.org/guide/getters.html#method-style-access

const BASE_URL = "http://localhost:5000/"
var userId = 18;

export const fetchData = async (path, requestData) => {
	const route = store.getters.getServerRoute(path);
	
	if (!route) {
		console.error("Invalid route name:" + path); //TODO: Későbbi megfelelő hibakezelés...
		return;
	}

	//params is not necessary but it can be added if required by the path
	const Get = (param1 = null, param2 = null) => {
		let url = BASE_URL + route;
		if (param1 != null) {
			url += param1;
		if (param1 != null && param2 != null) {
			url += "/" + param2;
		}
			console.log("TEST Parameters" + url);
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: url,
				type: "get",
				success: function (responseData, textStatus, jqXHR) {
					//console.log("get: ", responseData)
					resolve(responseData);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(errorThrown, 'url: ' + url);
					reject(textStatus, jqXHR.status, errorThrown);
				},
			});
		});
	};

	const Post = () => {
		try {
			return new Promise((resolve, reject) => {
				$.ajax({
					headers: {
						'Authorization': '',
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					success: function (data, textStatus, jqXHR) {
						//console.log("success:" + data)
						resolve(textStatus);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log("error: " + jqXHR , " ", textStatus, errorThrown
						+ "| sentData: " + JSON.stringify(requestData)
						)
						reject(errorThrown);
					},
					'type': 'POST',
					'url': BASE_URL + route,
					'data': JSON.stringify(requestData),
					'dataType': 'json'
				});
			})
		}
		catch (err) {
			console.error("Error fetching data:", err);
			return null;
		}
	}

	if (path == 'GetUserById') return Get()
	if (path == 'GetAllChatRoom' || 
		path == 'GetChatContent') return Get(userId)
	if (path == 'GetNotifications') return Get(userId + "/true")
	if (path == 'GetAllPeople') return Get(userId + "/" + requestData)
	if (path == 'Search') return Get(requestData)

	if (path == 'postComment' || 
		path == 'register' || 
		path == "PostChatMessage" ||
		path == "PostFriendRequest" ||
		path == 'NotificationRead'
		) return await Post()
	
	if (path == 'uploadImage') {
		// console.log(path, requestData);
		var myBuffer = new ArrayBuffer(16);
		var img = new Int8Array(myBuffer);
		let jsondata = {
			userId: 1,
			img: "123,123,123,123",
			token: "sdfgpj5345"
		}

		$.ajax({
			headers: {
				'Authorization': '',
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			success: function (responseData, textStatus, jqXHR) {
				console.log("success")
				console.log(textStatus + ": " + jqXHR.status);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("error " + textStatus + ": " + jqXHR.status + " " + errorThrown);
			},
			'type': 'PUT',
			'url': BASE_URL + route,
			'data': JSON.stringify(requestData),
			'dataType': 'json'
		});
	}
	
	// if (path == 'searchBox') {
	// 	$.ajax({
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		url: unwrapped + this.searchText,
	// 		type: "get",
	// 		data: {
	// 			'firstName': this.firstName,
	// 			'middleName': this.middleName,
	// 			'lastName': this.lastName,
	// 			'Friends': this.Friends,
	// 			'birthOfPlace': this.birthOfPlace
	// 		},
	// 		success: function (data) {
	// 			responseData = data
	// 			router.push("/searchResult");
	// 		},
	// 		error: function (data) {
	// 			console.log("server not available");
	// 		},
	// 	});
	// 	return data;
	// }

	// if (path == 'NotificationRead') {
	// 	try {
	// 		$.ajax({
	// 			headers: {
	// 				'Authorization': '',
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json'
	// 			},
	// 			success: function (responseData, textStatus, jqXHR) {
	// 				console.log("isreaded" + responseData)
	// 			},
	// 			error: function (jqXHR, textStatus, errorThrown) {
	// 				console.log("isn't readed" + jqXHR.status)
	// 			},
	// 			'type': 'POST',
	// 			'url': BASE_URL + route + requestData,
	// 			data: JSON.stringify(requestData),
	// 			'dataType': 'json'
	// 		});
	// 	}
	// 	catch (err) {
	// 		console.error("Error fetching data:", err);
	// 		return null;
	// 	}
	// };

}

export { BASE_URL }