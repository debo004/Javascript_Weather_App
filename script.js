const wrapper = document.querySelector(".wrapper");
inputPart = wrapper.querySelector(".input-part");
infoText = inputPart.querySelector(".info-txt");
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
wIcon = document.querySelector(".weather-part img");
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        // console.log("hello");
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=> {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your device does not support the Geolocation API");
    }
});

function onSuccess(position) {
    // console.log(position);
    let apiKey = `3c3f1d22cb3ae2d32c6df7e5d73f1dec`;
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    // console.log(error);
    infoText.innerText = error.message;
    infoText.classList.add("error");
}

function requestApi(city) {
    // console.log(city);
    let apiKey = `3c3f1d22cb3ae2d32c6df7e5d73f1dec`;
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoText.innerText = "Getting Weather Details . . . ";
    infoText.classList.add("pending");

    fetch(api).then(response => (response.json()).then(result => weatherDetails(result)));
}

function weatherDetails(info) {
    if(info.cod == "404") {
        infoText.innerText = `${inputField.value} isn't a valid city name !`;
        infoText.classList.replace("pending", "error");
    }
    else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if (id == 800) {
            wIcon.src = "weather-app-icons/Weather Icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "weather-app-icons/Weather Icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "weather-app-icons/Weather Icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "weather-app-icons/Weather Icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "weather-app-icons/Weather Icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "weather-app-icons/Weather Icons/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoText.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener("click", ()=> {
    wrapper.classList.remove("active");
    // inputField.value == "";
});