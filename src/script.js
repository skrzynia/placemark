import { getWeather } from "./utility.js";

window.addEventListener("DOMContentLoaded", (e) =>
{

 const city = document.getElementById("address").innerHTML.split("-->")[1].split(",")[0];

 const weatherMap = getWeather(city);

 document.getElementById("weather").src = weatherMap.weather;
 document.getElementById("temperature").innerHTML = weatherMap.temperature;

});