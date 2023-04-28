/*issues!
how to get buttons to call previous searches
styling*/
var date = dayjs();
var cityNameEl = document.querySelector(".cityname");
var citySearchEl = document.querySelector(".subbutton");
var clearSearchEl = document.querySelector(".clearbutton");
var searchHistoryEl = document.querySelector(".searches");
var mainTempEL = document.querySelector(".herocontainer")
var cityFeaturedEL = document.querySelector(".mainname");
var cityDetails = document.querySelector(".maindesc");
var futureContainerEl = document.querySelector(".futurecontainers")
var futureDetailsNodeList = document.querySelectorAll(".futuretemps");
var apiKey = "c3644d4bd3928fab3c281a08091b70b0";
var oneCallKey = "c4bea1998d641c9cfd206ef0165142e5";
var cityLat = ""
var cityLon = ""
var previousCitiesFromLocalStorage = [];
//render previous buttons on page load.
function init(){
    var favTemp = localStorage.getItem("cityHistory");
    if(favTemp){ 
        previousCitiesFromLocalStorage = JSON.parse(favTemp);
    }
    renderBtns();
  }

  init();

//function for rendering buttons
function renderBtns() {
    searchHistoryEl.innerHTML = "";
    for (i = 0; i < previousCitiesFromLocalStorage.length; i++) {
        var pastCity = document.createElement("button");
        pastCity.setAttribute("class", "pastbtn my-1");
        pastCity.dataset.lat = previousCitiesFromLocalStorage[i].lat;
        pastCity.dataset.lon = previousCitiesFromLocalStorage[i].lon;
        pastCity.textContent = previousCitiesFromLocalStorage[i].location;
        searchHistoryEl.appendChild(pastCity);
        pastCity.addEventListener("click", function(event){
            cityLat = event.target.dataset.lat
            cityLon = event.target.dataset.lon
            getOneCallWeather(event.target.textContent);    
        });
    }
};

//function for clearing previous searches
function clearbtns () {
    localStorage.removeItem("cityHistory");
    localStorage.clear();
    previousCitiesFromLocalStorage = [];
    searchHistoryEl.innerHTML = "";
    cityNameEl.innerHTML = "";
}


//function to take the name of a city, and find the lat and Lon for it, to be inputted in the next call
function findCoord() {
    var inputVal = cityNameEl.value;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputVal}&limit=1&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if(data.length == 0) {
                alert("Please enter a correct location.");
                return null;
            }
            cityLat = data[0].lat;
            cityLon = data[0].lon;
            //creating an object to store for past search buttons
            var cityObj = {
                location: inputVal,
                lat: cityLat,
                lon: cityLon
            }
            //creating said buttons
            previousCitiesFromLocalStorage.push(cityObj);
            localStorage.setItem("cityHistory", JSON.stringify(previousCitiesFromLocalStorage));
            renderBtns();
        })
        .then(getOneCallWeather);
}
//uses the previous lat and Lon values to find the extact weather details 
function getOneCallWeather(cityName) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${cityLat}&lon=${cityLon}&appid=${oneCallKey}&units=imperial&exclude=minutely,hourly,alerts`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            //Since the 3.0 API does not include the city name, uses the name put into the text input
            var showcaseInput = cityName || cityNameEl.value;
            mainTempEL.classList.add("maintemp")
            cityFeaturedEL.innerHTML = "";
            cityDetails.innerHTML = "";
            //adding icon
            cityFeaturedEL.innerHTML = showcaseInput + " " + dayjs.unix(data.current.dt).format("MM/DD/YYYY") + "<img src='https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'/>";
            cityFeaturedEL.classList.add("title", "has-text-weight-bold");
            //creating and appending the temp, humidity, and wind speed to the showcase weather
            var featureTempEL = document.createElement("li");
            featureTempEL.classList.add("featuredesc", "subtitle");
            featureTempEL.innerHTML = "Temp: " + data.current.temp;
            cityDetails.appendChild(featureTempEL);
            var featureHumidEl = document.createElement("li");
            featureHumidEl.classList.add("featuredesc", "subtitle");
            featureHumidEl.innerHTML = "Humidity: " + data.current.humidity;
            cityDetails.appendChild(featureHumidEl);
            var featureWind = document.createElement("li");
            featureWind.classList.add("featuredesc", "subtitle");
            featureWind.innerHTML = "Wind: " + data.current.wind_speed + " Mph";
            cityDetails.appendChild(featureWind);
            //setting a background for the future forecasts
            futureContainerEl.classList.add("has-background-grey-light")
            //looping through the next five days and setting the highlights from each
            for (let j = 0; j < 5; j++) {
                futureDetailsNodeList[j].innerHTML = "";
                var futureDateEL = document.createElement("h2");
                futureDateEL.innerHTML = dayjs.unix(data.daily[j].dt).format("MM/DD/YYYY");
                futureDateEL.classList.add("has-text-weight-bold", "center");
                futureDetailsNodeList[j].appendChild(futureDateEL);
                var futureIcon = document.createElement("img");
                futureIcon.setAttribute("src", 'https://openweathermap.org/img/wn/' + data.daily[j].weather[0].icon + '@2x.png');
                futureIcon.classList.add("futureimages");
                futureDetailsNodeList[j].appendChild(futureIcon);
                var futureTempEl = document.createElement("h2");
                futureTempEl.innerHTML = "Temp: " + data.daily[j].temp.day;
                futureDetailsNodeList[j].appendChild(futureTempEl);
                var futureHumidEL = document.createElement("h2");
                futureHumidEL.innerHTML = "Humidity: " + data.daily[j].humidity;
                futureDetailsNodeList[j].appendChild(futureHumidEL);
                var futureWindEL = document.createElement("h2");
                futureWindEL.innerHTML = "Wind: " + data.daily[j].wind_speed + " Mph";
                futureDetailsNodeList[j].appendChild(futureWindEL);
            }
        })

}



citySearchEl.addEventListener("click", findCoord);
// searchHistoryEl.addEventListener("click", runWeatherFetch);
clearSearchEl.addEventListener("click", clearbtns);
