let selectedInfo = {};
import { getWeather } from "./weather";
import { getLocationFetch, updateUIPlaces, baseURL, username, placenameValue, postData } from "./geonames"; 


console.log('-------------------- app.js (1) -----------------------');

const placenameInput = document.querySelector('#placename');

// Get location from geonames using the value typed in the input
function getLocation(placenameValue) {  
	
    //Inside the callback function call the async GET request with parameters.
    getLocationFetch(baseURL, placenameValue, username)

    .then(function(data) {
		postData('http://localhost:8081/addPlacenames', {'object': data.geonames})
			.then(function() {
				updateUIPlaces();
			});
    })
}

//Call the function that will get the weather
function getWeatherAndImage() {
	getWeather();
}

export { placenameInput, getLocation, getWeatherAndImage, selectedInfo };