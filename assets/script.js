//var currentWeather = document.querySelector('#current-weather');
var currentWeather = $('#current-weather');
var searchButton = document.querySelector('#search-button');
var cityEntry = document.querySelector('#city');
//var putCityNameHere = document.querySelector('#current-weather-city');
var putCityNameHere = $('#current-weather-city');
var displayCurrentWeather = $('#current-weather-container');
var date = moment().format("l");
var fiveDayForecastContainer = $('#five-day-forecast');

var city;
var key = "&units=imperial&appid=5c59a4ba07900dd57c10bb6885668c89"
var lat;
var lon;

//upon searching for a city, empty data from previous display, and send city searched to api call function
var searchHandler = function (event) {
    event.preventDefault();
    displayCurrentWeather.empty();
    fiveDayForecastContainer.empty();

    city = cityEntry.value.trim();
    console.log(city);
    if (city) {
        getApi(city);
        currentWeather.textContent = '';
        cityEntry.value = '';
    } else {
        alert('Please enter a city');
    }
};

//api call for current weather for city searched
function getApi(cityCurrent) {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityCurrent + key
    console.log(requestUrl);
    console.log("FIRST");
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



//display data for current weather 
var displayWeather = function (currentWeatherToDisplay, cityCurrentWeather) {
    
    //add city searched and current date to display
    putCityNameHere.text(currentWeatherToDisplay.name + "  (" + date + ")");
    
    //get longitude and lattitude for api call to get UV Index
    var lat = currentWeatherToDisplay.coord.lat;
    console.log(lat);
    var lon = currentWeatherToDisplay.coord.lon;
    console.log(lon);


    console.log(currentWeatherToDisplay.main.temp);
    console.log(currentWeatherToDisplay.main.humidity);

    var icon = $('<img></img>')
    icon.attr('src', "http://openweathermap.org/img/wn/" + currentWeatherToDisplay.weather[0].icon + ".png")
    displayCurrentWeather.append(icon);

    var temperature = $('<p></p>');
    temperature.attr('class', 'temp');
    temperature.text("Temperature: " + currentWeatherToDisplay.main.temp + " °F");
    displayCurrentWeather.append(temperature);

    var humidity = $('<p></p>');
    humidity.attr('class', 'humidity');
    humidity.text("Humidity: " + currentWeatherToDisplay.main.humidity + " %");
    displayCurrentWeather.append(humidity);

    var windSpeed = $('<p></p>');
    windSpeed.attr('class', 'wind-speed');
    windSpeed.text("WindSpeed: " + currentWeatherToDisplay.wind.speed + " MPH");
    displayCurrentWeather.append(windSpeed);

    getUV (lat, lon);
}

//get UV index from api
function getUV(lat, lon) {
    console.log(lat);
    console.log(lon);
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + "lat=" + lat + "&lon=" + lon + key
    console.log(requestUrl);
    console.log("SECOND");
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                displayUV(data);
                });
            } else {
                alert('Error:' + response.statusText);
            }
        })
        .catch(function(error) {
            alert('unable to connect to open Weather');
        });
}

//display the UV index
var displayUV = function (dataForUV) { 
    console.log(dataForUV);
    var uvIndex = $('<p></p>');
    uvIndex.attr('id', 'uv-index');

    if (dataForUV.current.uvi < 3) {
        uvIndex.addClass('green');
    } else if (dataForUV.current.uvi < 6) {
        uvIndex.addClass('yellow');
    } else if (dataForUV.current.uvi < 8) {
        uvIndex.addClass('orange');
    } else if (dataForUV.current.uvi < 11) {
        uvIndex.addClass('red');
    } else {
        uvIndex.addClass('purple');
    }

    uvIndex.text("UV Index: " + dataForUV.current.uvi);
    displayCurrentWeather.append(uvIndex);
    //console.log(lat, lon);
    displayFiveDay(dataForUV);
}

//get data from api for the five day forecast
// function getFiveDayApi(dataForUV, lat, lon) {
//     var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityCurrent + key
//     console.log(requestUrl);
//     console.log("THIRD");
//     fetch(requestUrl)
//         .then(function (response) {
//             if (response.ok) {
//                 console.log(response);
//                 response.json().then(function(data) {
//                     console.log(data);
//                     displayFiveDay(data);
//                 });
//             } else {
//                 alert('Error:' + response.statusText);
//             }
//         })
//         .catch(function(error) {
//             alert('unable to connect to open Weather');
//         });
// };

//display five day forecast
var displayFiveDay = function (fiveDayWeatherToDisplay) {

    //loop for each day of the five day forecast
    for (var i=1; i<6; i++) {

        //create container for each day of the five day forecast
        var dayContainer = $('<div></div>');
        dayContainer.attr = $('class', "day-container")
        fiveDayForecastContainer.append(dayContainer);

        //function to convert unix date to human date
        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
            var month = months[a.getMonth()];
            var date = a.getDate();
            var year = a.getFullYear();
            var time = month + '/' + date + '/' + year
            return time;
        }
        
        //create element for date, get date from api, append to five day forecast container
        var eachDate = $('<p></p>');
        eachDate.text(timeConverter(fiveDayWeatherToDisplay.daily[i].dt));
        dayContainer.append(eachDate)
        
        //create element for icon, get icon from api, append to five day forecast container
        var icon = $('<img></img>')
        icon.attr('src', "http://openweathermap.org/img/wn/" + fiveDayWeatherToDisplay.daily[i].weather[0].icon + ".png")
        dayContainer.append(icon);

        //create element for temp, get temp from api, append to five day forecast container 
        var fiveDayTemp = $('<p></p>');
        fiveDayTemp.attr('class', 'temp');
        fiveDayTemp.text("Temperature: " + fiveDayWeatherToDisplay.daily[i].temp.day + " °F");
        dayContainer.append(fiveDayTemp);

        //create element for humidity, get humidity from api, append to five day forecast container
        var humidity = $('<p></p>');
        humidity.attr('class', 'humidity');
        humidity.text("Humidity: " + fiveDayWeatherToDisplay.daily[i].humidity + " %");
        dayContainer.append(humidity);
    }
 
}

searchButton.addEventListener('click', searchHandler);


