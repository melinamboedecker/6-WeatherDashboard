//var currentWeather = document.querySelector('#current-weather');
var currentWeather = $('#current-weather');
var searchButton = document.querySelector('#search-button');
var cityEntry = document.querySelector('#city');
//var putCityNameHere = document.querySelector('#current-weather-city');
var putCityNameHere = $('#current-weather-city');
var displayCurrentWeather = $('#current-weather-container');

var key = "&units=imperial&appid=5c59a4ba07900dd57c10bb6885668c89"

var searchHandler = function (event) {
    event.preventDefault();

    var city = cityEntry.value.trim();
    console.log(city);
    if (city) {
        getApi(city);

        currentWeather.textContent = '';
        cityEntry.value = '';
    } else {
        alert('Please enter a city');
    }
};

function getApi(cityCurrent) {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityCurrent + key

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayWeather(data, cityCurrent);
                });
            } else {
                alert('Error:' + response.statusText);
            }
        })
        .catch(function(error) {
            alert('unable to connect to open Weather');
        });
};





var displayWeather = function (currentWeatherToDisplay, cityCurrentWeather) {
    putCityNameHere.text(cityCurrentWeather);
    console.log(cityCurrentWeather);
    
    var lat = currentWeatherToDisplay.coord.lat;
    console.log(lat);
    var lon = currentWeatherToDisplay.coord.lon;
    console.log(lon);


    console.log(currentWeatherToDisplay.main.temp);
    console.log(currentWeatherToDisplay.main.humidity);

    var temperature = $('<p></p>');
    temperature.attr('id', 'temp');
    temperature.text("Temperature: " + currentWeatherToDisplay.main.temp);
    displayCurrentWeather.append(temperature);

    var humidity = $('<p></p>');
    humidity.attr('id', 'humidity');
    humidity.text("Humidity: " + currentWeatherToDisplay.main.humidity);
    displayCurrentWeather.append(humidity);

    var windSpeed = $('<p></p>');
    windSpeed.attr('id', 'wind-speed');
    windSpeed.text("WindSpeed: " + currentWeatherToDisplay.wind.speed + " units?");
    displayCurrentWeather.append(windSpeed);

    var uvIndex = $('<p></p>');
    uvIndex.attr('id', 'uv-index');
    uvIndex.text("UV Index: ");

}

searchButton.addEventListener('click', searchHandler);


//http://api.openweathermap.org/data/2.5/forecast?zip=95361,us&units=imperial&appid=5c59a4ba07900dd57c10bb6885668c89