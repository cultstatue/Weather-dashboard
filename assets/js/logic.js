var mainContainer = document.querySelector("#main-container");
var searchContainer = document.querySelector("#search-container");
var weatherContainer = document.querySelector("weather-container");

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
inputTextEl.innerHTML = "<input class='input' type='text' placeholder='Search city name'> <span class ='icon is-left'><i class='fas fa-search' aria-hidden='true'></i></span>"
formContainer.appendChild(inputTextEl);