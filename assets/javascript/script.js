const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const suggestions = document.getElementById('suggestions');

cityInput.addEventListener('input', () => {
    const query = cityInput.value;
    if (query.length > 2) {
        getCitySuggestions(query);
    } else {
        suggestions.style.display = 'none';
    }
});

function getCitySuggestions(query) {
    const geoDbUrl = `${config.geoDbApiUrl}?namePrefix=${query}&limit=5&types=CITY`;

    fetch(geoDbUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': config.geoDbApiKey,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            showSuggestions(data.data);
        } else {
            suggestions.style.display = 'none';
        }
    })
    .catch(err => console.error(err));
}

function showSuggestions(cities) {
    suggestions.innerHTML = '';
    if (cities.length > 0) {
        cities.forEach(city => {
            const cityDiv = document.createElement('div');
            cityDiv.textContent = `${city.city}, ${city.country}`;
            cityDiv.addEventListener('click', () => {
                cityInput.value = city.city;
                suggestions.style.display = 'none';
            });
            suggestions.appendChild(cityDiv);
        });
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}


searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city name");
    }
});

function getWeather(city) {
    const url = `${config.weatherApiUrl}?q=${city}&appid=${config.weatherApiKey}&units=metric&lang=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('city-name').textContent = data.name;
                document.getElementById('temperature').textContent = `${data.main.temp}°C`;
                document.getElementById('weather-status').textContent = data.weather[0].description;
                document.getElementById('humidity').textContent = `${data.main.humidity}%`;
                document.getElementById('wind-speed').textContent = `${data.wind.speed} Km/h`;

                const weatherIcon = document.getElementById('weather-icon');
                weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIcon.style.display = 'block';
            } else {
                alert("City not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data: ", error);
        });
}


document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-bar')) {
        suggestions.style.display = 'none';
    }
});
