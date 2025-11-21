const apiKey = "d7a1736f9f4f7233511ba9c3c572d4bb";

async function fetchWeather() {
    const searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");

    weatherDataSection.style.display = "block";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    // Clear input field
    document.getElementById("search").value = "";

    // 1. Get Coordinates
    const geocodeData = await getLonAndLat(searchInput);

    // Stop if geocode failed
    if (!geocodeData) return;

    // 2. Get Weather using Coordinates
    getWeatherData(geocodeData.lon, geocodeData.lat, weatherDataSection);
}

async function getLonAndLat(query) {
    const weatherDataSection = document.getElementById("weather-data");

    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${query.replace(" ", "%20")}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }
        const data = await response.json();

        if (data.length === 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${query}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    } catch (error) {
        console.log("Error fetching geocode:", error);
        weatherDataSection.innerHTML = `<div><h2>Connection Error</h2></div>`;
    }
}

async function getWeatherData(lon, lat, weatherDataSection) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.style.display = "flex";

        // Displaying Temp, Desc, Humidity, and Wind Speed
        weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            </div>
        `;
    } catch (error) {
        console.log("Error fetching weather:", error);
    }
}