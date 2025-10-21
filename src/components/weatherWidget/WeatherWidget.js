import { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

const WeatherWidget = ({ coordinates, destinationName }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("We get the cordinates ",coordinates);
  

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const API_KEY = '19e05d2e461adfec26c56a32f754c18a';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${API_KEY}&units=metric`
        );
        
        setWeather(response.data);
        setError(null);
      } catch (err) {
        setError('Weather data not available');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates.lat, coordinates.lng]);

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="weather-loading">Loading weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">{error}</div>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getSeasonAdvice = (temp) => {
    if (temp > 30) return "🌞 Hot - Light clothing recommended";
    if (temp > 20) return "😊 Pleasant - Perfect for outdoor activities";
    if (temp > 10) return "🧥 Cool - Bring a jacket";
    if (temp > 0) return "❄️ Cold - Warm clothing essential";
    return "🥶 Very Cold - Heavy winter gear needed";
  };

  return (
    <div className="weather-widget">
      <h3>🌤️ Current Weather in {destinationName}</h3>
      <div className="weather-content">
        <div className="weather-main">
          <img 
            src={getWeatherIcon(weather.weather[0].icon)} 
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <div className="weather-temp">
            {Math.round(weather.main.temp)}°C
          </div>
        </div>
        
        <div className="weather-details">
          <div className="weather-description">
            {weather.weather[0].description}
          </div>
          
          <div className="weather-stats">
            <div className="weather-stat">
              <span className="stat-label">Feels like:</span>
              <span className="stat-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="weather-stat">
              <span className="stat-label">Humidity:</span>
              <span className="stat-value">{weather.main.humidity}%</span>
            </div>
            <div className="weather-stat">
              <span className="stat-label">Wind:</span>
              <span className="stat-value">{weather.wind.speed} m/s</span>
            </div>
            <div className="weather-stat">
              <span className="stat-label">Pressure:</span>
              <span className="stat-value">{weather.main.pressure} hPa</span>
            </div>
          </div>

          <div className="weather-advice">
            <strong>Packing Advice:</strong> {getSeasonAdvice(weather.main.temp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;