//https://pixabay.com/api/
//Retrieving photos of "yellow flowers". The search term q needs to be URL encoded: 
//https://pixabay.com/api/?key=26903953-2ae04a9d8106595496ec8b6b0&q=yellow+flowers&image_type=photo
//image_type=photo
//orientation=horizontal
//category=places
//per_page=3

import { selectedInfo } from './app';

let selectedPlace;

console.log('---------------- pixabay ---------------------');

function getImage(selectedPlace) {
    // console.log('get image');

    let baseURL = `https://pixabay.com/api/?key=`;
    const imageType = '&image_type=photo';
    const orientation = '&orientation=horizontal';
    const category = '&category=places';
    const perPage = '&per_page=3';
    if(selectedPlace == undefined) {
        selectedPlace = `${selectedInfo.city}`;
        console.log('selectedPlace inside if');
        console.log(selectedPlace);
    }
    const encodedPlace = `&q=${encodeURIComponent(selectedPlace)}`;
    // console.log(encodedPlace);
        
    //Inside that callback function call your async GET request with the parameters:
    getImageFetch(baseURL, imageType, orientation, category, perPage, encodedPlace)

    .then(function(data) {
        console.log('pixabay data');
        console.log(data);
        console.log('image data');
       
        if(data.hits[0] == undefined) {
            console.log('I am undefined');
            console.log(selectedPlace);
            selectedPlace = selectedInfo.country;
            console.log(selectedPlace);
            getImage(selectedPlace);
            console.log('get image selected place');
        } else {
            postDataImg('http://localhost:8081/image', {imageUrl: data.hits[0].largeImageURL})
            .then(function(data) {
                console.log('update UI image');
                updateUIImg();
        });}    

    })
    
}
    
    
    
    //Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
    let getImageFetch = async (baseURL, imageType, orientation, category, perPage, encodedPlace) => {
    
    
    
        const apiKeyPixabay = await fetch('http://localhost:8081/apiKeyPixabay')
        .then(response => response.json())
        .then(data => data.key);
    
    
    
        const res = await fetch (baseURL+apiKeyPixabay+encodedPlace+imageType+orientation+category+perPage);
    
        // console.log('res pixabay');
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
    const postDataImg = async ( url = 'http://localhost:8081/image', data = {})=> {
    
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
            // console.log('post image data');
            return newData;
    
        } catch(error) {
            console.log("error", error);
        }
    }
    
    // Update the UI
    const updateUIImg = async () => {
        const request = await fetch('http://localhost:8081/getImage');
        try{
            const allData = await request.json();
            console.log('allData image');
            console.log(allData);
            const formBg = document.querySelector('.form-bg');
            formBg.style.backgroundImage = `url('${allData.imageUrl}')`;

            
            // document.getElementById('date').innerHTML = `🌡️ ${Math.trunc(allData.temperature)} °C`;
            // document.getElementById('temp').innerHTML = `📅 ${formatDate(allData.date)}`;
            // document.getElementById('content').innerHTML = `🌈 ${allData.feelings}`;

        } catch (error) {
            console.log("error", error);
        }
    }








export { getImage, getImageFetch, postDataImg, updateUIImg };