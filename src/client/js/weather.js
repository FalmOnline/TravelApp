// here we need to import the city name cityName
//https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&include=minutely&key=89ed4ef885a34702877771d7c2ef22b7
//https://api.weatherbit.io/v2.0/history/daily?postal_code=27601&country=US&start_date=2022-04-22&end_date=2022-04-23&key=API_KEY
import { selectedInfo } from './app';
import { formatDate, date } from './date-picker'; 
import { getImage } from './pixabay';

console.log('---------------- weather ---------------------');


/* Global Variables */

let baseURL, currentTime, mySelectedTime, daysTillTravel;



function getWeather(e) {  

	currentTime = date.getTime();
	mySelectedTime = parseInt(selectedInfo.date.getTime());
	daysTillTravel = Math.ceil((mySelectedTime - currentTime)/(24*60*60*1000));


	if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
		baseURL = `https://api.weatherbit.io/v2.0/current?lat=${selectedInfo.lat}&lon=${selectedInfo.lng}&include=minutely&key=`;
		// console.log('current');
	} else if (daysTillTravel > 7) {
		baseURL = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${selectedInfo.lat}&lon=${selectedInfo.lng}&key=`;
		// console.log('forecast');
	} else {
		alert('Please select a future date');
		preventDefault(e);
	}


//If trip is within a week, get the current weather forecast

//if selected date <= current date + 7 get current weather forecast (use the current link for fetching)
//if selected date > current date + 7 get future weather forecast
//if selected date < current date => Message ('Please select a future date')

//if trip is in the future get a predicted forecast.
//Get weather based on coordinates
//Display the image of the location entered from Pixabay API

    

    //Inside that callback function call your async GET request with the parameters:
    getWeatherFetch(baseURL)
	
    .then(function(data) {
		let selectedObject;
		// console.log('weather data');
		if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
			// console.log(data);
			selectedObject = {temperature: data.data[0].temp, description: data.data[0].weather.description, clouds: data.data[0].clouds, precipitations: data.data[0].precip };
		} else if ((daysTillTravel > 7) && (daysTillTravel < 17)) {
			// console.log('all forecast data');
			// console.log(data);
			const forecastData = data.data[daysTillTravel-1];
			// console.log('forecastData');
			// console.log(forecastData);
			selectedObject = {lowTemperature: forecastData.min_temp, highTemperature: forecastData.max_temp, description: forecastData.weather.description, clouds: forecastData.clouds, precipitations: forecastData.precip };
		} else {
			console.log('out of range');
		}
		
	// console.log(data.data[0].temp);
	  getImage();
      postDataWeather('http://localhost:8081/weather', selectedObject).then(function(data) {
		// console.log('update UI');
		updateUIWeather();
	  }); 
    });

}



//Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
const getWeatherFetch = async (baseURL) => {



	const apiKeyWeather = await fetch('http://localhost:8081/apikeyWeather')
	.then(response => response.json())
	.then(data => data.key);



    const res = await fetch (baseURL+apiKeyWeather);

	// console.log('res weather');
	// console.log(res);

    try {
      const data = await res.json();
      return data;

    }  catch (error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

// // Make POST request
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
		// console.log('post weather data');
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
		// console.log('allData weather');
		// console.log(allData);

		if ((daysTillTravel <= 7) && (daysTillTravel > 0)) {
			weatherInfo = `
			<p><strong>Typical weather for then is:</strong></p>
			<p>${allData.description}</p>
			<p>🌡️ Temperature: ${Math.trunc(allData.temperature)} °C</p>
			<p>☁️ Clouds: ${Math.trunc(allData.clouds)}%</p>
			<p>☂️ Precipitations: ${Math.trunc(allData.precipitations)}%</p>
			`;
		} else if((daysTillTravel > 7) && (daysTillTravel < 17)) {
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