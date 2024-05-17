// script.js
async function getWeather() {
    const location = document.getElementById('location').value;
    const apiKey = process.env.API_KEY; // This will work with a Node.js environment
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.cod !== '200') {
            alert('Location not found. Please try again.');
            return;
        }

        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = ''; // Clear previous results

        // Group weather data by day
        const weatherByDay = {};
        data.list.forEach(entry => {
            const date = new Date(entry.dt_txt).toLocaleDateString();
            if (!weatherByDay[date]) {
                weatherByDay[date] = [];
            }
            weatherByDay[date].push(entry);
        });

        // Create weather cards for each day
        Object.keys(weatherByDay).forEach(date => {
            const dayWeather = weatherByDay[date];
            const avgTemp = (dayWeather.reduce((sum, entry) => sum + entry.main.temp, 0) / dayWeather.length).toFixed(1);
            const description = dayWeather[0].weather[0].description;

            const weatherCard = document.createElement('div');
            weatherCard.className = 'weather-card';

            const dateElement = document.createElement('h3');
            dateElement.innerText = date;
            weatherCard.appendChild(dateElement);

            const tempElement = document.createElement('p');
            tempElement.innerText = `Avg Temp: ${avgTemp} °C`;
            weatherCard.appendChild(tempElement);

            const descElement = document.createElement('p');
            descElement.innerText = description;
            weatherCard.appendChild(descElement);

            weatherContainer.appendChild(weatherCard);
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
