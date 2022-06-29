// capturing hard-coded elements
var mainContainer = document.querySelector("#main-container");
var searchContainer = document.querySelector("#search-container");
var weatherContainer = document.querySelector("#weather-container");

// creating initial HTML elements for search column
var searchBox = document.createElement("nav");
searchBox.className = "panel is-info";
searchContainer.appendChild(searchBox);

var searchTitle = document.createElement("p")
searchTitle.className = "panel-heading";
searchTitle.textContent = "Search by city"
searchBox.appendChild(searchTitle);

var formContainer = document.createElement("div");
formContainer.className = "panel-block";
searchBox.appendChild(formContainer);

var inputTextEl = document.createElement("p");
inputTextEl.className = "control has-icons-left";
inputTextEl.innerHTML = "<form id ='input-form'><input class='input' id='cityname' type='text' placeholder='Search city name'> <span class ='icon is-left'><i class='fas fa-search' aria-hidden='true'></i></span></form>"
formContainer.appendChild(inputTextEl);

var inputForm = document.querySelector("#cityname")

// function to convert unix time to a date
var convertDate = function(unixInput) {

    var milliseconds = unixInput * 1000;

    var dateObject = new Date(milliseconds);

    var parseDateObject = dateObject.toLocaleDateString();

    return parseDateObject;
}

// function to remove all parents children
var removeChildren = function (parent) {

    while(parent.firstChild) {
  
      parent.removeChild(parent.firstChild);
  
    }
}  

// function to create daily forecast cards
var createForecasts = function(weather, box) {

    console.log(weather);

    var cardColumn = document.createElement("div");
    cardColumn.classList.add('block', 'columns');
    weatherContainer.appendChild(cardColumn);

    for (i = 1; i < 6; i++) {

        var newCard = document.createElement("div")
        newCard.classList.add('card', 'column')
        cardColumn.appendChild(newCard);

        var newCardContent = document.createElement("div");
        newCardContent.className = "card-content";
        newCard.appendChild(newCardContent);

        var newCardTitle = document.createElement("h1");
        newCardTitle.classList.add('title', 'is-4')
        newCardTitle.textContent = convertDate(weather[i].dt);
        newCardContent.appendChild(newCardTitle);

        var newCardWeatherContent = document.createElement("div")
        newCardWeatherContent.className = "content";
        newCardWeatherContent.innerHTML = 
        "<figure class='image is-center image is-64x64'>" + 
        "<img src='http://openweathermap.org/img/wn/" + weather[i].weather[0].icon + "@2x.png' /></figure>" + 
        "<br /><b>Temperature:</b> " + weather[i].temp.day + "° F" + 
        "<br /><b>Wind Speed:</b> " + weather[i].wind_speed + " MPH" +
        "<br /><b>Humidity:</b> " + weather[i].humidity + " %";
        
        newCard.appendChild(newCardWeatherContent);
    }

}

// function to generate weather elements
var displayWeatherElements = function(currentWeather, futureWeather) {
    
    console.log(currentWeather);
    console.log(futureWeather);

    if(weatherContainer.childNodes.length > 0) {

        removeChildren(weatherContainer);

    }

    var weatherBoxEl = document.createElement("nav");
    weatherBoxEl.classList.add('panel', 'is-info', 'weather-box');
    weatherContainer.appendChild(weatherBoxEl);

    var cityName = document.createElement("p"); // need to add date here too
    cityName.innerHTML = "<img src='http://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png' width='35' height='30'/> " + currentWeather.name + " (" + convertDate(currentWeather.date) + ")";
    cityName.classList.add('panel-heading')
    weatherBoxEl.appendChild(cityName);

    var currentTemp = document.createElement("div");
    currentTemp.classList.add('block')
    currentTemp.innerHTML = "<b>Temperature:</b> " + currentWeather.temp + "° F";
    weatherBoxEl.appendChild(currentTemp);

    var currentHumidity = document.createElement("div");
    currentHumidity.classList.add('block')
    currentHumidity.innerHTML = "<b>Humidity:</b> " + currentWeather.humidity + " %";
    weatherBoxEl.appendChild(currentHumidity);

    var currentWind = document.createElement("div");
    currentWind.classList.add('block')
    currentWind.innerHTML = "<b>Wind Speed:</b> " + currentWeather.wind + " MPH";
    weatherBoxEl.appendChild(currentWind);

    var currentUVI = document.createElement("div")
    currentUVI.classList.add('block')

    if (currentWeather.uv <= 4) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-success'>" + currentWeather.uv + "</span>";

    } else if (currentWeather.uv > 4 || currentWeather.uv < 8) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-warning'>" + currentWeather.uv + "</span>";

    } else if (currentWeather.uv >= 8) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-danger'>" + currentWeather.uv + "</span>";
    }

    weatherBoxEl.appendChild(currentUVI);

    createForecasts(futureWeather, weatherBoxEl);
}

// function to get weather info from location
var getWeatherdata = function(lat, lon, cityName) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly&units=imperial&appid=f36d17786468fcf6dab864e03af92392"

    fetch(apiUrl).then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {

          console.log(data)

          var currentWeatherObject = {

            name: cityName,
            icon: data.current.weather[0].icon,
            temp: data.current.temp,
            humidity: data.current.humidity,
            wind: data.current.wind_speed,
            uv: data.current.uvi,
            date: data.current.dt

          }

          var futureWeatherObject = data.daily;

          displayWeatherElements(currentWeatherObject, futureWeatherObject);

        });
      } else {

        alert('City location not found');

      }
    })
    .catch(function(error) {

      alert("Unable to connect to OpenWeather");
      
    });
}

// function to get location data
var getLocationData = function(cityName) {

    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=f36d17786468fcf6dab864e03af92392";  fetch(apiUrl)
   
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
        response.json().then(function(data) {

          console.log(data)

          if(data === undefined || data.length == 0) {

            alert("City location not found")
            return false;

          } else {

            var cityNameState = data[0].name + ", " + data[0].state;
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;

            getWeatherdata(cityLat, cityLon, cityNameState);
          }

        })
    
    }).catch (function(error) {

        alert("Unable to connect to OpenWeather");

    })
   
  };


// add event listender to submission form
searchContainer.addEventListener("submit", function(event) {

    event.preventDefault();

    var cityName = inputForm.value.trim().toLowerCase();
    console.log(cityName);

    if (cityName) {

        getLocationData(cityName);
        inputForm.value = " ";
        
    } else {

        alert("Please enter a valid city name")

    }

});

