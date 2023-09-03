import { mapGetters } from "vuex";
import $ from 'jquery'
import store from '../stores/config.js';
//https://vuex.vuejs.org/guide/getters.html#method-style-access

const BASE_URL = "http://localhost:5000"

export const fetchData = async (path, requestData) => {
	const route = store.getters.getServerRoute(path);
	
	if (!route) {
		console.error("Invalid route name"); //TODO: Későbbi megfelelő hibakezelés...
		return;
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

	//Todo: connection
	if (path == 'postComment') {
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
}

export { BASE_URL }
