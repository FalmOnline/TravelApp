import { selectedInfo } from './app';

let selectedPlace;

// Create the elements that are necessary in order to fetch the data from the API
function getImage(selectedPlace) {
    let baseURL = `https://pixabay.com/api/?key=`;
    const imageType = '&image_type=photo';
    const orientation = '&orientation=horizontal';
    const category = '&category=places';
    const perPage = '&per_page=3';
    if(selectedPlace == undefined) {
        selectedPlace = `${selectedInfo.city}`;
    }
    const encodedPlace = `&q=${encodeURIComponent(selectedPlace)}`;

    //Fetch the API data, then post the data and update the UI. If there is no image when searching for the city name, then use the country instead.
    getImageFetch(baseURL, imageType, orientation, category, perPage, encodedPlace)
    .then(function(data) {    
        if(data.hits[0] == undefined) {
            selectedPlace = selectedInfo.country;
            getImage(selectedPlace);
        } else {
            postDataImg('http://localhost:8081/image', {imageUrl: data.hits[0].largeImageURL})
            .then(function(data) {
                updateUIImg();
            });
        }    
    }) 
}
    

//Write an async function that uses fetch() to make a GET request to the Pixabay API.
let getImageFetch = async (baseURL, imageType, orientation, category, perPage, encodedPlace) => {
    const apiKeyPixabay = await fetch('http://localhost:8081/apiKeyPixabay')
    .then(response => response.json())
    .then(data => data.key);

    const res = await fetch (baseURL+apiKeyPixabay+encodedPlace+imageType+orientation+category+perPage);

    try {
        const data = await res.json();
        return data;
    }  catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}
    
// Make POST request
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
        const formBg = document.querySelector('.form-bg');
        formBg.style.backgroundImage = `url('${allData.imageUrl}')`;
    } catch (error) {
        console.log("error", error);
    }
}

export { getImage, getImageFetch, postDataImg, updateUIImg };