import { mapGetters } from "vuex";
import $ from 'jquery'
import store from '../stores/config.js';
//https://vuex.vuejs.org/guide/getters.html#method-style-access

const BASE_URL = "http://localhost:5000/"



export const fetchData = async (path, requestData) => {
	const route = store.getters.getServerRoute(path);
	
	if (!route) {
		console.error("Invalid route name:" + path); //TODO: Későbbi megfelelő hibakezelés...
		return;
	}

	const Get = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: BASE_URL + route + requestData,
				type: "get",
				success: function (responseData, textStatus, jqXHR) {
					console.log("get: ", responseData)
					resolve(responseData);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(errorThrown, 'url: ' + BASE_URL + route + requestData);
					reject(textStatus, jqXHR.status, errorThrown);
				},
			});
		});
	};

	const Post = () => {
		try {
			$.ajax({
				headers: {
					'Authorization': '',
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				success: function (data, textStatus, jqXHR) {
					console.log("no resp" + data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR , " ", textStatus, errorThrown)
				},
				'type': 'POST',
				'url': BASE_URL + route,
				'dataType': 'json'
			});
		}
		catch (err) {
			console.error("Error fetching data:", err);
			return null;
		}
	}

	if (path == 'GetAllPeople') { return Get(); };
	if (path == "GetChatContent") { return Get(); };
	
	//Todo: connection
	if (path == 'postComment') {
		return Post();
	}

	if (requestData) { // if has request body, for post and put
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
					console.log("error")

					console.log(textStatus + ": " + jqXHR.status + " " + errorThrown);
				},
				'type': 'PUT',
				'url': BASE_URL + route,
				'data': JSON.stringify(requestData),
				'dataType': 'json'
			});
			
		}
	}


	if (path == 'searchBox') {
		$.ajax({
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			url: unwrapped + this.searchText,
			type: "get",
			data: {
				'firstName': this.firstName,
				'middleName': this.middleName,
				'lastName': this.lastName,
				'Friends': this.Friends,
				'birthOfPlace': this.birthOfPlace
			},
			success: function (data) {
				responseData = data
				router.push("/searchResult");
			},
			error: function (data) {
				console.log("server not available");
			},
		});
		return data;
	}

	if (path == 'register') {
		return new Promise((resolve, reject) => {
			$.ajax({
				headers: {
					'Authorization': '',
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: BASE_URL + '/users',
				type: "POST",
				'data': requestData,
				success: function (responseData, textStatus, jqXHR) {
					console.log('success: ' + jqXHR.status);
					resolve(textStatus);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("error server_route " + requestData);
					reject(requestData);
				},
			});
		});	
	};

	if (path == "PostFriendRequest") {
		try {
			return new Promise((resolve, reject) => {
				$.ajax({
					headers: {
						'Authorization': '',
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					success: function (responseData, textStatus, jqXHR) {
						resolve(responseData);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						reject(jqXHR.status);
					},
					'type': 'POST',
					'url': BASE_URL + route,
					'data': requestData,
					'dataType': 'json'
				});
			});
		} catch (Exception ) {
			console.log(Exception)
		}
	};
	

	if (path == 'GetAllChatRoom') {
		const id = requestData;
		return new Promise((resolve, reject) => {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: BASE_URL + route + requestData,
				type: "get",
				success: function (responseData, textStatus, jqXHR) {
					console.log("get: ", responseData)
					resolve(responseData);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(errorThrown)
					reject(textStatus, jqXHR.status, errorThrown);
				},
			});
		});	}

		if (path == 'GetNotifications') {
			return new Promise((resolve, reject) => {
				$.ajax({
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					url: BASE_URL + route + "18/true", //Todo: this is for test for now
					type: "get",
					success: function (responseData, textStatus, jqXHR) {
						//console.log(responseData[0])
						resolve(responseData);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						reject(textStatus, jqXHR.status, errorThrown);
					},
				});
			});
		};

	if (path == 'NotificationRead') {
		try {
			$.ajax({
				headers: {
					'Authorization': '',
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				success: function (responseData, textStatus, jqXHR) {
					console.log("isreaded" + responseData)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("isn't readed" + jqXHR.status)
				},
				'type': 'POST',
				'url': BASE_URL + route + requestData,
				data: JSON.stringify(requestData),
				'dataType': 'json'
			});
		}
		catch (err) {
			console.error("Error fetching data:", err);
			return null;
		}
	};


	if (path == 'GetUserById') {
		return new Promise((resolve, reject) => {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: BASE_URL + route + requestData,
				type: "get",
				success: function (responseData, textStatus, jqXHR) {
					resolve(responseData);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, jqXHR.status, errorThrown)
					reject(textStatus, jqXHR.status, errorThrown);
				},
			});
		});
	};


	
}

const PostMethod = () => {
	
}

export { BASE_URL }
