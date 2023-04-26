/*Things to add!
Use local storage to save past searches and add them below search bar (see previous classes for this? Unsure)
Current searches only show one city? Why?
current loop has same day as featured weather as first option, how to add one day to 5 day call?
popluate empty divs w/information on search button press (use for loop for buttons, how to add to the next day in a for loop?) 
    - Note: All elements are appended into one div! How to populate all 4 divs?
once js is functional style site*/
var date = dayjs();
var cityNameEl = document.querySelector(".cityname");
var citySearchEl = document.querySelector(".subbutton");
var searchHistoryEl = document.querySelector(".searches");
var mainTempEL = document.querySelector(".herocontainer")
var cityFeaturedEL = document.querySelector(".mainname");
var cityDetails = document.querySelector(".maindesc");
var futureContainerEl = document.querySelector(".futurecontainers")
var futureDetails = document.querySelector(".futuretemps"); 
var apiKey = "c3644d4bd3928fab3c281a08091b70b0";
var cityLat = ""
var cityLon = ""

function findCoord() {
var inputVal = document.querySelector("userInput")
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputVal}&limit=1&appid=${apiKey}`)
    .then (function (response) {
        return response.json();
    })
    .then (function (data){
        console.log(data);
        cityLat = data[0].lat;
        cityLon = data[0].lon;
    })
    .then(weatherReport);

function weatherReport(){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=imperial`)
    .then (function (response) {
        return response.json()
    })
    .then (function (data) {
        console.log(data);
    mainTempEL.classList.add("maintemp")
    cityFeaturedEL.innerHTML = data.name + " " + dayjs.unix(data.dt).format("MM/DD/YYYY") + "<img src='https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png'/>";   
    cityFeaturedEL.classList.add( "title", "has-text-weight-bold", "level-left");
    var featureTempEL = document.createElement("li");
    featureTempEL.classList.add("featuredesc");
    featureTempEL.innerHTML = "Temp: " + data.main.temp;
    cityDetails.appendChild(featureTempEL);
    var featureHumidEl = document.createElement("li");
    featureHumidEl.classList.add("featuredesc");
    featureHumidEl.innerHTML = "Humidity: " + data.main.humidity;
    cityDetails.appendChild(featureHumidEl);
    var featureWind = document.createElement("li");
    featureWind.classList.add("featuredesc");
    featureWind.innerHTML = "Wind: " + data.wind.speed + " Mph";
    cityDetails.appendChild(featureWind);
     })
    .then(futureWeather);

function futureWeather(){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=imperial`)
    .then (function(response){
        return response.json()
    })
    .then(function(data) {
        console.log(data);
        futureContainerEl.classList.add("has-background-grey-light")
        for(i = 3; i < data.list.length; i = i + 8) {
          var futureDateEL = document.createElement("h2");
          futureDateEL.innerHTML = dayjs.unix(data.list[i].dt).format("MM/DD/YYYY");
          futureDateEL.classList.add("has-text-weight-bold");
          futureDetails.appendChild(futureDateEL);
          var futureIcon = document.createElement("img");
          //add block class?
          futureIcon.setAttribute("src", 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png')
          futureDetails.appendChild(futureIcon);
          var futureTempEl = document.createElement("h2");
          futureTempEl.innerHTML = "Temp: " + data.list[i].main.temp;
          //add block class?
          futureDetails.appendChild(futureTempEl);
          var futureHumidEL = document.createElement("h2");
          futureHumidEL.innerHTML = "Humidity: " + data.list[i].main.humidity;
          //class
          futureDetails.appendChild(futureHumidEL);
          var futureWindEL = document.createElement("h2");
          futureWindEL.innerHTML = "Wind: " + data.list[i].wind.speed + " Mph";
          //class
          futureDetails.appendChild(futureWindEL);
        }
    })
    }
}
}

citySearchEl.addEventListener("click", findCoord)

//TODO: past searches help (from class)
//function rendersearchHistory(){ 
//var searchHistory = JSON.parse(localStorage.getItem("cityHistory(set past searches to localStorage w/this name)")) || [];
//for (i = 0; i < cityHistory.length; i++){
//var pastCity = document.createElement("button");
// pastCity.setAttribute("class", "TBD");
//cityButton.textContent(searchHistory[i]);
//searchHistoryEL.appendChild(pastCity);
//}};