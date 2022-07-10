// Setup empty JS object to act as endpoint for all routes
let projectData = {};

function forTestingOnTheServer(text) {
    return text;
}

var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

const dotenv = require('dotenv');
dotenv.config();

const apiKey = {
    key: `1105a42b3ce77d392c09d6e3a91a6982`
}

const apiKeyWeather = {
    key: `652972586a9b4eafad6a7f3b13274c12`
}

const apiKeyPixabay = {
    key: `26903953-2ae04a9d8106595496ec8b6b0`
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


// Respond with JS object when a GET request is made
app.get('/getPlacenames', function (req, res) {
    res.json(projectData.filteredNames);
});

app.get('/getWeather', function (req, res) {
    res.json(projectData.weatherData);
});

app.get('/getImage', function (req, res) {
    res.json(projectData.imageData);
});


app.post('/addPlacenames', addPlacename);

function addPlacename(req, res) {

    let filteredNames = req.body;
    projectData.filteredNames = filteredNames;

    // send the updated data back
    res.send(projectData.filteredNames);  
}

app.post('/weather', addWeather);

function addWeather(req, res) {

    let weatherData = req.body;
    projectData.weatherData = weatherData;

    // send the updated data back
    res.send(projectData.weatherData);  
}

app.post('/image', addImage);

function addImage(req, res) {
    let imageData = req.body;
    projectData.imageData = imageData;

    // send the updated data back
    res.send(projectData.imageData);  
}


// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})



module.exports = forTestingOnTheServer;