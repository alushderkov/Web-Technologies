require('dotenv').config();
const axios = require('axios');
const dayjs = require('dayjs');

const CITY = process.argv[2] || 'Minsk'; // Город из аргументов
const TOMORROW = dayjs().add(1, 'day').format('YYYY-MM-DD');

async function getWeatherApiTemp(city) {
  try {
    const key = process.env.WEATHERAPI_KEY;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=2&aqi=no&alerts=no`;
    const res = await axios.get(url);

    const forecast = res.data.forecast.forecastday.find(day => day.date === TOMORROW);
    if (!forecast) {
      console.error('Данные на завтра не найдены.');
      return;
    }

    const avgTemp = forecast.day.avgtemp_c;
    console.log(`Погода в городе ${city} на ${TOMORROW}:`);
    console.log(`Средняя температура: ${avgTemp.toFixed(1)}°C`);
  } catch (err) {
    console.error('Ошибка при получении данных от WeatherAPI:', err.message);
  }
}

getWeatherApiTemp(CITY);
