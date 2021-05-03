//var currentWeather = document.querySelector('#current-weather');
var currentWeather = $('#current-weather');
var searchButton = document.querySelector('#search-button');
var cityEntry = document.querySelector('#city');
//var putCityNameHere = document.querySelector('#current-weather-city');
var putCityNameHere = $('#current-weather-city');
var displayCurrentWeather = $('#current-weather-container');
var date = moment().format("l");
var fiveDayForecastContainer = $('#five-day-forecast');
var currentWeatherCard;
var listOfCities;
var cityHistory = $('#list-group');

var city;
var key = "&units=imperial&appid=5c59a4ba07900dd57c10bb6885668c89"
var lat;
var lon;

//empty current ul list
function init () {
    cityHistory.empty();
    displaySearchHistory();
}

//display city search history
function displaySearchHistory () {
    if (localStorage.getItem("cities") === null) {
        listOfCities = [];
    }
    else {
        listOfCities = JSON.parse(localStorage.getItem("cities"));
    }

    for (var i=0; i<listOfCities.length; i++) {
        var li = $('<li></li>');
        li.addClass('list-group-item');
        li.css('cursor', 'pointer');  
        li.text(listOfCities[i]);
        cityHistory.append(li);
    }

//displaySearchHistory();

var liList = $('li');

for (var i = 0; i < liList.length; i++) {
    liList[i].addEventListener('click', function (event) {
        console.log(this.textContent);
        getApi(this.textContent);
    })
}
};

//upon searching for a city, empty data from previous display, and send city searched to api call function
var searchHandler = function (event) {
    event.preventDefault();

    //set the city searched to variable
    city = cityEntry.value.trim();

    if (city) {
        getApi(city);
        currentWeather.textContent = '';
        cityEntry.value = '';
    } else {
        alert('Please enter a city');
        location.reload();
    }
};

//api call for current weather for city searched
function getApi(cityCurrent) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityCurrent + key
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
                location.reload();
            }
        })
        .catch(function(error) {
            alert('unable to connect to open Weather');
            location.reload();
        });
};



//display data for current weather 
var displayWeather = function (currentWeatherToDisplay, cityCurrentWeather) {

    //sets to empty array if nothing in local storage
    if (localStorage.getItem("cities") === null) {
        listOfCities = [];
    }
    //if data is in local storage, retrive it and put it into object
    else {
        listOfCities = [];
        listOfCities = JSON.parse(localStorage.getItem("cities"));
    }

    //puts new city into local storage if isn't already there
    
        if (listOfCities.indexOf(currentWeatherToDisplay.name) === -1) {
            listOfCities.push(currentWeatherToDisplay.name);
            localStorage.setItem("cities", JSON.stringify(listOfCities));
        }
    
    cityHistory.empty();

    for (var i=0; i<listOfCities.length; i++) {
        var li = $('<li></li>');
        li.addClass('list-group-item'); 
        li.css('cursor', 'pointer'); 
        li.text(listOfCities[i]);
        cityHistory.append(li);
    }

    liList = $('li');

    for (var i = 0; i < liList.length; i++) {
        liList[i].addEventListener('click', function (event) {
            getApi(this.textContent);
        });
    }


    //display titles for current weather and 5 day forecast
    $('h2').removeClass('subtitle');

    //remove previous values in current weather and 5 day forecast
    displayCurrentWeather.empty();
    fiveDayForecastContainer.empty();
    
    //add city searched and current date to display
    putCityNameHere.text(currentWeatherToDisplay.name + "  (" + date + ")");
    
    //get longitude and lattitude for api call to get UV Index
    var lat = currentWeatherToDisplay.coord.lat;
    var lon = currentWeatherToDisplay.coord.lon;

    currentWeatherCard = $('<div></<div>');
    currentWeatherCard.addClass('card');
    displayCurrentWeather.append(currentWeatherCard);

    var icon = $('<img></img>')
    icon.addClass('img');
    icon.attr('src', "https://openweathermap.org/img/wn/" + currentWeatherToDisplay.weather[0].icon + ".png")
    currentWeatherCard.append(icon);

    var temperature = $('<p></p>');
    temperature.attr('class', 'temp');
    temperature.text("Temperature: " + currentWeatherToDisplay.main.temp + " °F");
    currentWeatherCard.append(temperature);

    var humidity = $('<p></p>');
    humidity.attr('class', 'humidity');
    humidity.text("Humidity: " + currentWeatherToDisplay.main.humidity + " %");
    currentWeatherCard.append(humidity);

    var windSpeed = $('<p></p>');
    windSpeed.attr('class', 'wind-speed');
    windSpeed.text("WindSpeed: " + currentWeatherToDisplay.wind.speed + " MPH");
    currentWeatherCard.append(windSpeed);

    getUV (lat, lon);
}

//get UV index from api
function getUV(lat, lon) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + "lat=" + lat + "&lon=" + lon + key
    console.log(requestUrl);
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
    var uvIndex = $('<p></p>');
    uvIndex.text("UV Index: ");
    currentWeatherCard.append(uvIndex);
    

    var uvIndexValue = $('<span></span>')

    if (dataForUV.current.uvi < 3) {
        uvIndexValue.addClass('green');
    } else if (dataForUV.current.uvi < 6) {
        uvIndexValue.addClass('yellow');
    } else if (dataForUV.current.uvi < 8) {
        uvIndexValue.addClass('orange');
    } else if (dataForUV.current.uvi < 11) {
        uvIndexValue.addClass('red');
    } else {
        uvIndexValue.addClass('purple');
    }

    uvIndexValue.text(dataForUV.current.uvi);
    uvIndex.append(uvIndexValue);
    //send data to next function for five day forecast
    displayFiveDay(dataForUV);
}

//display five day forecast
var displayFiveDay = function (fiveDayWeatherToDisplay) {

    //loop for each day of the five day forecast
    for (var i=1; i<6; i++) {

        //create container for each day of the five day forecast
        var dayContainer = $('<div></div>');
        dayContainer.addClass('card col-sm ea-5-day');
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
        var eachDate = $('<h5></h5>');
        eachDate.addClass('card-title');
        eachDate.text(timeConverter(fiveDayWeatherToDisplay.daily[i].dt));
        dayContainer.append(eachDate)
        
        //create element for icon, get icon from api, append to five day forecast container
        var icon = $('<img></img>')
        icon.addClass('img');
        icon.attr('src', "https://openweathermap.org/img/wn/" + fiveDayWeatherToDisplay.daily[i].weather[0].icon + ".png")
        dayContainer.append(icon);

        //create element for temp, get temp from api, append to five day forecast container 
        var fiveDayTemp = $('<p></p>');
        fiveDayTemp.attr('class', 'temp');
        fiveDayTemp.text("Temp: " + fiveDayWeatherToDisplay.daily[i].temp.day + " °F");
        dayContainer.append(fiveDayTemp);

        //create element for humidity, get humidity from api, append to five day forecast container
        var humidity = $('<p></p>');
        humidity.attr('class', 'humidity');
        humidity.text("Humidity: " + fiveDayWeatherToDisplay.daily[i].humidity + " %");
        dayContainer.append(humidity);
    }
};


init();
searchButton.addEventListener('click', searchHandler);


