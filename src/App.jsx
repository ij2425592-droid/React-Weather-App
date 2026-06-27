import defaultImg from "./assets/default.png";
import clearImg from "./assets/clear.avif";
import cloudsImg from "./assets/clouds.avif";
import rainImg from "./assets/rain.avif";
import snowImg from "./assets/snow.avif";
import thunderstormImg from "./assets/thunderstorm.avif";

import { useState } from "react"
import "./App.css"

export default function App(){
  const [city, setCity]= useState("");
  const [weather, setWeather]= useState(null);
  const [loading, setLoading]= useState(false);
  const [error, setError]= useState("")

  const fetchWeather = async()=>{
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null)
  
    try{
      const response= await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5467f8a1bdc76881758a2642ea469219&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200){
        throw new Error (data.message);
      }
      setWeather(data);
      setCity("");
    } catch(err){
      setError("City not found");
    } finally {
    setLoading(false);
    }
  }


  const getBackgroundImage = (condition) => {
    switch (condition) {
      case "Clear":
        return clearImg;

      case "Clouds":
        return cloudsImg;

      case "Rain":
        return rainImg;

      case "Snow":
        return snowImg;

      case "Thunderstorm":
        return thunderstormImg;

      default:
        return defaultImg;
    }
  };

  return(
    <div className="app"
        style={{
          backgroundImage: `url(${
            weather
              ? getBackgroundImage(weather.weather[0].main)
              : defaultImg
          })`,
        }}
      >

      <div className="overlay">
        <div className="container">
          <h1>Weather App</h1>
          <div className="search-box">
            <input type="text" placeholder="Enter city name" value={city} onChange={(e)=>setCity(e.target.value)} onKeyDown={(e) =>{
              if (e.key === "Enter"){
                fetchWeather();
              }
            }} />
            <button onClick={fetchWeather}>Search</button>
          </div>
          
          {loading && <p>🔄 Loading weather...</p>}

          {error && <p>{error}</p>}

          {weather && (
            <div className="weather-card">

              <h2>{weather.name}, {weather.sys.country}</h2>

              <h2 className="temp">
                {Math.round(weather.main.temp)}°C
              </h2>

              <p className="icon">
                {weather.weather[0].main === "Clear" && "☀️"}
                {weather.weather[0].main === "Clouds" && "☁️"}
                {weather.weather[0].main === "Rain" && "🌧️"}
                {weather.weather[0].main === "Thunderstorm" && "⛈️"}
                {weather.weather[0].main === "Snow" && "❄️"}
              </p>

              <p>
                Condition: {weather.weather[0].main}
              </p>

              <div className="details">
                <div className="detail-box">
                  <h4>Humidity</h4>
                  <p>{weather.main.humidity}%</p>
                </div>

                <div className="detail-box">
                  <h4>Wind</h4>
                  <p>{weather.wind.speed} m/s</p>
                </div>
                
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}