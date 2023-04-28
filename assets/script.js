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

function init(){
    var favTemp = localStorage.getItem("cityHistory");
    if(favTemp){ 
        previousCitiesFromLocalStorage = JSON.parse(favTemp);
    }
    renderBtns();
  }

  init();

// $(searchHistoryEl).delegate(".pastbtn", "click", findPastCoord)

function renderBtns() {
    searchHistoryEl.innerHTML = "";
    for (i = 0; i < previousCitiesFromLocalStorage.length; i++) {
        var pastCity = document.createElement("button");
        pastCity.setAttribute("class", "pastbtn my-1");
        pastCity.dataset.lat = previousCitiesFromLocalStorage[i].lat;
        pastCity.dataset.lon = previousCitiesFromLocalStorage[i].lon;
        pastCity.textContent = previousCitiesFromLocalStorage[i].location;
        searchHistoryEl.appendChild(pastCity);
       
        // pastCity.addEventListener("click", findPastCoord);
    }
    // function findPastCoord() {
    //     var pastCityName = pastCity.textContent
    //     console.log(pastCity);
    //     console.log(pastCityName);
    //     fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${pastCityName}&limit=1&appid=${apiKey}`)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {

    //         if(data.length == 0) {
    //             alert("Please enter a correct location.");
    //             return null;
    //         }
    //         cityLat = data[0].lat;
    //         cityLon = data[0].lon;
    // })
    // .then(getOneCallWeather);
};


function clearbtns () {
    localStorage.removeItem("cityHistory");
    localStorage.clear();
    searchHistoryEl.innerHTML = "";
    cityNameEl.innerHTML = "";
}

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
            var cityObj = {
                location: inputVal,
                lat: cityLat,
                lon: cityLon
            }
            previousCitiesFromLocalStorage.push(cityObj);
            localStorage.setItem("cityHistory", JSON.stringify(previousCitiesFromLocalStorage));
            renderBtns();
        })
        .then(getOneCallWeather);
}

function getOneCallWeather() {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${cityLat}&lon=${cityLon}&appid=${oneCallKey}&units=imperial&exclude=minutely,hourly,alerts`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            var showcaseInput = cityNameEl.value;
            mainTempEL.classList.add("maintemp")
            cityFeaturedEL.innerHTML = "";
            cityDetails.innerHTML = "";
            cityFeaturedEL.innerHTML = showcaseInput + " " + dayjs.unix(data.current.dt).format("MM/DD/YYYY") + "<img src='https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'/>";
            cityFeaturedEL.classList.add("title", "has-text-weight-bold");
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
            futureContainerEl.classList.add("has-background-grey-light")
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
