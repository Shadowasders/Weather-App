/*Things to add!
Intregrate weather API
add functionality to search button (eventListener on click)
use local storage to save past searches and add them below search bar (see previous classes for this? Unsure)
popluate empty divs w/information on search button press (use for loop for buttons, how to add to the next day in a for loop?) 
find way to use the lil weather emojis for each type of weather, and figure out how to add them into the JS (insert, modify, append? where to find them to link w/webpage?)
once js is functional style site*/
//use template literals ${} in the fetch URL
var date = dayjs();
var cityNameEl = document.querySelector(".cityname");
var citySearchEl = document.querySelector(".subbutton");
var searchHistoryEl = document.querySelector(".searches");
var cityFeatured = document.querySelector(".mainname");
var cityDetails = document.querySelector(".maindesc");
var futureDetails = document.querySelector(".futuretemps"); 
var apiKey = "c3644d4bd3928fab3c281a08091b70b0";
var cityLat = ""
var cityLon = ""

function findCoord() {
var cityParse = citySearchEl.value;
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityParse}&limit=1&appid=${apiKey}`)
    .then (function (response) {
        return response.json();
    })
    .then (function (data){
        cityLat = data[0].lat;
        console.log(cityLat);
        cityLon = data[0].lon;
        console.log(cityLon); 
    })
    .then(weatherReport);
    // console.log(cityLat);
    // console.log(cityLon);


function weatherReport(){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
    .then (function (response) {
        return response.json
    })
    .then (function (data) {
        console.log(data);
    })
};
}

findCoord();
// citySearchEl.addEventListener("click", )

//TODO: past searches help (from class)
//function rendersearchHistory(){ 
//var searchHistory = JSON.parse(localStorage.getItem("cityHistory(set past searches to localStorage w/this name)")) || [];
//for (i = 0; i < cityHistory.length; i++){
//var pastCity = document.createElement("button");
// pastCity.setAttribute("class", "TBD");
//cityButton.textContent(searchHistory[i]);
//searchHistoryEL.appendChild(pastCity);
//}};