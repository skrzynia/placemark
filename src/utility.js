/* eslint-disable prefer-destructuring */
import dotenv from "dotenv";
import fetch from "node-fetch";


export async function getWeather(cityname) {
    const result = dotenv.config()
    const APIkey = process.env.weather_api_key;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

   const response = await fetch(url).then(data => data.json());

   const icon = response.weather[0].icon;

   const a = {
    temperature: Math.round(Number(response.main.temp) - 273.15),
    weather: `https://openweathermap.org/img/wn/${icon}@4x.png`,
    lat: response.coord.lat,
    lon: response.coord.lon
    };


    return a;
}

