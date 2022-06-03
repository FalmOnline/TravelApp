
console.log('---------------- app ---------------------');
let selectedInfo = {};
import { getWeather } from "./weather";
import { getLocationFetch, updateUIPlaces, baseURL, username, placenameValue, postData } from "./geonames"; 

const generateRequest = document.querySelector('#generate');


//Enter the location you are traveling to
//Get coordinates from the city
const placenameInput = document.querySelector('#placename');

function getLocation(placenameValue) {  
	
    //Inside that callback function call your async GET request with the parameters:
    getLocationFetch(baseURL, placenameValue, username)

    .then(function(data) {
		// console.log(4);
		// console.log('data inside app.js');
		// console.log(data);
		// console.log('data.name');
		// console.log(data.geonames);
		postData('http://localhost:8081/addPlacenames', {'object': data.geonames})
			.then(function(data) {
				updateUIPlaces();
			});
    })
}

//Pick the date you are leaving

function getWeatherAndImage(e) {
	getWeather();
}


export { placenameInput, getLocation, getWeatherAndImage, selectedInfo };