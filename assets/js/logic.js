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

// function to remove all parents children
var removeChildren = function (parent) {

    while(parent.firstChild) {
  
      parent.removeChild(parent.firstChild);
  
    }
}  

// function to generate weather elements
var displayWeatherElements = function(currentWeather, futureWeather) {
    
    console.log(currentWeather);
    console.log(futureWeather);

    if(weatherContainer.childNodes.length > 0) {

        removeChildren(weatherContainer);
    }

    var weatherBoxEl = document.createElement("div");
    weatherBoxEl.className = "box"
    weatherContainer.appendChild(weatherBoxEl);

    var cityName = document.createElement("h1");
    cityName.textContent = currentWeather.name
    weatherBoxEl.appendChild(cityName);

    var currentTemp = document.createElement("p");
    currentTemp.innerHTML = "<b>Temperature:</b> " + currentWeather.temp + "° F";
    weatherBoxEl.appendChild(currentTemp);

    var currentHumidity = document.createElement("p");
    currentHumidity.innerHTML = "<b>Humidity:</b> " + currentWeather.humidity;
    weatherBoxEl.appendChild(currentHumidity);

    var currentWind = document.createElement("p");
    currentWind.innerHTML = "<b>Wind Speed:</b> " + currentWeather.wind;
    weatherBoxEl.appendChild(currentWind);

    var currentUVI = document.createElement("p")

    if (currentWeather.uv <= 4) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-success'>" + currentWeather.uv + "</span>";

    } else if (currentWeather.uv > 4 || currentWeather.uv < 8) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-warning'>" + currentWeather.uv + "</span>";

    } else if (currentWeather.uv >= 8) {

        currentUVI.innerHTML = "<b>UVI:</b> <span class='tag is-danger'>" + currentWeather.uv + "</span>";
    }

    weatherBoxEl.appendChild(currentUVI);


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
            temp: data.current.temp,
            humidity: data.current.humidity,
            wind: data.current.wind_speed,
            uv: data.current.uvi

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

