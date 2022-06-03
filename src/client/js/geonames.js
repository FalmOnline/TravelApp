import { list } from "postcss";
// import { onChangeValue } from "./listeners";
import { getLocation, placenameInput, selectedInfo } from "./app";


console.log('---------------- geonames ---------------------');


//http://api.geonames.org/postalCodeLookupJSON?placename=Alba-Iulia&username=falmonline

/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const username = '&maxRows=20&username=falmonline'; 
let placenameValue;



function onChangeValue(event) {
	// console.log(1);
    event.preventDefault();
    const placenameValue = placenameInput.value.toLowerCase();
	if(placenameInput.value.length>3) {
		// console.log(placenameValue);
		getLocation(placenameValue);
	}

}


//Write an async function in app.js that uses fetch() to make a GET request to the Geolocation API.
const getLocationFetch = async (baseURL, placenameValue, username) => {

    const res = await fetch (baseURL+placenameValue+username);

    try {
      const data = await res.json();
	//   console.log(3);
	//   console.log('data');
	//   console.log(data);

      return data;
    }  catch (error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

// // Make POST request
const postData = async ( url = '/addPlacenames', data = {})=> {
	
	// console.log(5);
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json',
	},
	// Body data type must match "Content-Type" header        
	body: JSON.stringify(data), 
	});

	try {
		// console.log(7);
		const newData = await response.json();
		// console.log('newData');
		// console.log(newData);
		// console.log('----------------------------------------------------------------');
        return newData;
	} catch(error) {
		console.log("error", error);
	}
}


//Update the UI
const updateUIPlaces = async () => {
	// console.log(6);
	const request = await fetch('http://localhost:8081/getPlacenames');
	try{
		// console.log(8);
		const allData = await request.json();
		// console.log('allData');
		// console.log(allData);

		const allDataArray = allData.object;

		// console.log('allDataArray');
		// console.log(allDataArray);


		const place = document.querySelector('#place .form-wrapper');

		// console.log('place');
		// console.log(place);
		const listEl = document.createElement('ul');
		listEl.className = 'list-of-places';

		// console.log('allDataArray');
		// console.log(allDataArray);

		createDropdown(allDataArray);
		
		function createDropdown(listOfPlaces) {
			// console.log(9);
			// console.log(listOfPlaces);
			removeOldElements();
			listOfPlaces.forEach((place) => {

				const entry = `
				<li>
					<button class="placename" data-city="${place.name}" data-lng="${place.lng}" data-lat="${place.lat}" data-countrycode="${place.countryCode}" data-country="${place.countryName}">${place.name}, ${place.adminName1}, ${place.countryCode}</button>
				</li>
				`;
				listEl.insertAdjacentHTML("beforeend", entry);
			});
		}


		place.insertAdjacentElement("beforeend", listEl);

		

		function removeOldElements() {
			// console.log(10);
			const listID = document.querySelector('.list-of-places');
			if(listID) {
				listID.remove();
			}
		}

		function chooseValue(e) {
			// console.log(11);
			e.preventDefault();
			// console.log('e.target');
			// console.log(e.target);
			selectedInfo.city = `${e.target.dataset.city}`;
			selectedInfo.lng = `${e.target.dataset.lng}`;
			selectedInfo.lat = `${e.target.dataset.lat}`;
			selectedInfo.countryCode = `${e.target.dataset.countrycode}`;
			selectedInfo.country = `${e.target.dataset.country}`;
			// console.log('selectedInfo');
			// console.log(selectedInfo);
			// choose the object from the list and return it
			placenameInput.value = `${e.target.innerText.split(",")[0]}`;
			removeOldElements();
			return selectedInfo;
		}

		listEl.addEventListener('click', chooseValue);


	} catch (error) {
		console.log("error", error);
	}
}


export { placenameInput, onChangeValue, getLocationFetch, updateUIPlaces, baseURL, username, placenameValue, postData }