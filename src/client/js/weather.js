import { selectedInfo } from './app';
import { date } from './date-picker'; 
import { getImage } from './pixabay';


/* Global Variables */
let baseURL, currentTime, mySelectedTime, daysTillTravel;


// Prepare all the pieces of information needed to make the fetch to the API.
function getWeather(e) {  
	currentTime = date.getTime();
	mySelectedTime = parseInt(selectedInfo.date.getTime());
	daysTillTravel = Math.ceil((mySelectedTime - currentTime)/(24*60*60*1000));

	//If trip is within a week, get the current weather forecast, if after 7 days, get the future weather forecast, else show an alert to select a future date.
	if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
		baseURL = `https://api.weatherbit.io/v2.0/current?lat=${selectedInfo.lat}&lon=${selectedInfo.lng}&include=minutely&key=`;
	} else if (daysTillTravel > 7) {
		baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${selectedInfo.lat}&lon=${selectedInfo.lng}&key=`;
	} else {
		alert('Please select a future date');
		preventDefault(e);
	}  

    //Make a call to the weatherbit API, using the convenient baseURL, according to the days till the departure, call the function that gets the image,post the data and update the UI.
    getWeatherFetch(baseURL)
    .then(function(data) {
		let selectedObject;

		//If the vacation starts in the first week, use the information for the current weather and if departure is between 7 and 16 days display the future forecast.
		//If travel is more de 16 days, there is no weather data to display.
		if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
			selectedObject = {temperature: data.data[0].temp, description: data.data[0].weather.description, clouds: data.data[0].clouds, precipitations: data.data[0].precip };
		} else if ((daysTillTravel > 7) && (daysTillTravel < 17)) {
			const forecastData = data.data[daysTillTravel-1];
			selectedObject = {lowTemperature: forecastData.min_temp, highTemperature: forecastData.max_temp, description: forecastData.weather.description, clouds: forecastData.clouds, precipitations: forecastData.precip };
		} else {
			console.log('out of range');
		}
		
		getImage();
		postDataWeather('http://localhost:8081/weather', selectedObject).then(function(data) {
		updateUIWeather();
	  }); 
    });
}

//An async function that uses fetch() to make a GET request to the weatherbit API.
const getWeatherFetch = async (baseURL) => {
	const apiKeyWeather = await fetch('http://localhost:8081/apikeyWeather')
	.then(response => response.json())
	.then(data => data.key);

    const res = await fetch (baseURL+apiKeyWeather);

    try {
      const data = await res.json();
      return data;
    }  catch (error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

//Make POST request
const postDataWeather = async ( url = 'http://localhost:8081/weather', data = {})=> {
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

// Update the UI
const updateUIWeather = async () => {
	const request = await fetch('http://localhost:8081/getWeather');
	try{
		let weatherInfo;
		const allData = await request.json();

		if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
			weatherInfo = `
				<p><strong>Typical weather for then is:</strong></p>
				<p>${allData.description}</p>
				<p>🌡️ Temperature: ${Math.trunc(allData.temperature)} °C</p>
				<p>☁️ Clouds: ${Math.trunc(allData.clouds)}%</p>
				<p>☂️ Precipitations: ${Math.trunc(allData.precipitations)}%</p>
			`;
		} else if ((daysTillTravel > 7) && (daysTillTravel < 17)) {
			weatherInfo = `
				<p><strong>Typical weather for then is:</strong></p>
				<p>${allData.description}</p>
				<p>🌡️ Minumum temperature: ${Math.trunc(allData.lowTemperature)} °C</p>
				<p>🌡️ Maximum temperature: ${Math.trunc(allData.highTemperature)} °C</p>
				<p>☁️ Clouds: ${Math.trunc(allData.clouds)}%</p>
				<p>☂️ Precipitations: ${Math.trunc(allData.precipitations)}%</p>
			`;
		} else {
			weatherInfo = `<p>There is no weather data for more than 16 days away.</p>`
		}

		//When picture is loaded, show the overlay
		const overlay = document.querySelector('.overlay');
		if(!overlay.classList.contains('active')) {
			overlay.classList.add('active');
		}
		document.getElementById('city-country-days').innerHTML = `📅 ${selectedInfo.city}, ${selectedInfo.country} is ${daysTillTravel} days away.`;
		document.querySelector('.form-results').innerHTML = weatherInfo;
	} catch (error) {
		console.log("error", error);
	}
}

export { getWeather, getWeatherFetch, postDataWeather, updateUIWeather };