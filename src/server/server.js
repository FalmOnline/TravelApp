// Setup empty JS object to act as endpoint for all routes
let projectData = {};

var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const dotenv = require('dotenv');
dotenv.config();

const apiKey = {
    key: `${process.env.API_KEY_GEONAMES}`
}

const apiKeyWeather = {
    key: `${process.env.API_KEY_WEATHER}`
}

const apiKeyPixabay = {
    key: `${process.env.API_KEY_PIXABAY}`
}

const app = express()
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.get('/apikey', function(req, res) {
    res.json(apiKey);
})

app.get('/apiKeyWeather', function(req, res) {
    res.json(apiKeyWeather);
})

app.get('/apiKeyPixabay', function(req, res) {
    res.json(apiKeyPixabay);
})


// Respond with JS object when a GET request is made to the homepage
app.get('/getPlacenames', function (req, res) {

    // console.log('project getPlaces');
    // console.log(projectData.filteredNames);
    // res.send(projectData);
    res.json(projectData.filteredNames);
});

app.get('/getWeather', function (req, res) {

    console.log('project get');
    console.log(projectData.weatherData);
    // res.send(projectData);
    res.json(projectData.weatherData);
});

app.get('/getImage', function (req, res) {
    console.log('image get');
    console.log(projectData.imageData);
    // res.send(projectData.imageData);
    res.json(projectData.imageData);
});


app.post('/addPlacenames', addPlacename);

function addPlacename(req, res) {
    //  console.log(req.body);

    let filteredNames = req.body;

    // console.log(filteredNames);


    projectData.filteredNames = filteredNames;
    // console.log('projectData');
    // console.log(projectData);
    res.send(projectData.filteredNames);  // send the updated data back
}

app.post('/weather', addWeather);

function addWeather(req, res) {
    //  console.log(req.body);

    let weatherData = req.body;

    console.log('weatherData');
    console.log(weatherData);


    projectData.weatherData = weatherData;
    console.log('projectData');
    res.send(projectData.weatherData);  // send the updated data back
}

app.post('/image', addImage);

function addImage(req, res) {
    //  console.log(req.body);

    let imageData = req.body;

    console.log('imageData');
    console.log(imageData);


    projectData.imageData = imageData;
    console.log('projectData imagedata');
    res.send(projectData.imageData);  // send the updated data back
}




// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


