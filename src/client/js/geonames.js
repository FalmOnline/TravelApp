import { getLocation, placenameInput, selectedInfo } from "./app";


/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const username = '&maxRows=20&username=falmonline'; 
let placenameValue;

//When typing a name in the City input call the onChangeValue function
function onChangeValue(event) {
    event.preventDefault();
    const placenameValue = placenameInput.value.toLowerCase();
	if(placenameInput.value.length>3) {
		getLocation(placenameValue);
	}
}

//An async function that uses fetch() to make a GET request to the Geolocation API.
const getLocationFetch = async (baseURL, placenameValue, username) => {
    const res = await fetch (baseURL+placenameValue+username);

    try {
      const data = await res.json();
      return data;
    }  catch (error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

// // Make POST request
const postData = async ( url = '/addPlacenames', data = {})=> {

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
		const newData = await response.json();
        return newData;
	} catch(error) {
		console.log("error", error);
	}
}

//Update the UI
const updateUIPlaces = async () => {
	const request = await fetch('http://localhost:8081/getPlacenames');
	try{
		const allData = await request.json();
		const allDataArray = allData.object;
		const place = document.querySelector('#place .form-wrapper');

		const listEl = document.createElement('ul');
		listEl.className = 'list-of-places';

		createDropdown(allDataArray);
		
		function createDropdown(listOfPlaces) {
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
			const listID = document.querySelector('.list-of-places');
			if(listID) {
				listID.remove();
			}
		}

		function chooseValue(e) {
			e.preventDefault();
			selectedInfo.city = `${e.target.dataset.city}`;
			selectedInfo.lng = `${e.target.dataset.lng}`;
			selectedInfo.lat = `${e.target.dataset.lat}`;
			selectedInfo.countryCode = `${e.target.dataset.countrycode}`;
			selectedInfo.country = `${e.target.dataset.country}`;
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