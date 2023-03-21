import dotenv from "dotenv";

export async function getWeather(cityname) {
    const result = dotenv.config()
    const APIkey = process.env.weather_api_key;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

   const json = await fetch(url)
    .then(data => {data.json()});

    temperature = JSON.parse(json);
}

