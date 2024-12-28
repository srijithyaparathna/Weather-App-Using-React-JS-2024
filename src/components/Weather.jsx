import React, { useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloude_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef(null); // Ref for the input field
  const [weatherData, setWeatherData] = useState(null); // State for weather data
  const [suggestions, setSuggestions] = useState([]); // State for city suggestions

  // Icon mapping for weather conditions
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloude_icon,
    "02n": cloude_icon,
    "03d": cloude_icon,
    "03n": cloude_icon,
    "04d": cloude_icon,
    "04n": cloude_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": drizzle_icon,
    "50n": drizzle_icon,
  };

  // Fetch weather data
  const searchWeather = async (city) => {
    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data. Status: ${response.status}`);
      }

      const data = await response.json();
      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        temperature: Math.floor(data.main.temp),
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: icon,
      });

      // Clear suggestions
      setSuggestions([]);
    } catch (error) {
      alert(`Failed to fetch weather data: ${error.message}`);
    }
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]); // Clear suggestions if the query is empty
      return;
    }

    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching suggestions. Status: ${response.status}`);
      }

      const cities = await response.json();

      // Create a Set to filter out duplicate city names
      const uniqueCityNames = [...new Set(cities.map((city) => city.name))];

      // Update suggestions with unique city names
      setSuggestions(uniqueCityNames);
    } catch (error) {
      console.error("Error fetching city suggestions:", error.message);
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    const query = event.target.value.trim();
    fetchCitySuggestions(query); // Fetch suggestions
  };

  // Handle suggestion click
  const handleSuggestionClick = (city) => {
    inputRef.current.value = city; // Set input value
    setSuggestions([]); // Clear suggestions
    searchWeather(city); // Fetch weather data
  };

  // Handle search button click
  const handleSearch = () => {
    const city = inputRef.current.value.trim();
    searchWeather(city); // Fetch weather data
  };

  return (
    <div className="weather">
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          ref={inputRef}
          onChange={handleInputChange}
        />
        <img
          src={search_icon}
          alt="Search Icon"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="dropdown">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}

      {/* Weather information */}
      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind Icon" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
