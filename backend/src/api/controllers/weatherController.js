const axios = require('axios');
require('dotenv').config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const buildAdvisory = (data) => {
  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const upcoming = data.list.filter((item) => {
    const forecastDate = new Date(item.dt * 1000);
    return forecastDate >= now && forecastDate <= threeDaysLater;
  });

  if (upcoming.length === 0) {
    return {
      location: data.city?.name || 'your area',
      alert: 'Weather data unavailable for the next 3 days. Monitor local forecasts for farming decisions.',
      type: 'info',
      tempMin: null,
      tempMax: null,
      conditions: [],
      rainExpected: false
    };
  }

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let totalRain = 0;
  let hasHeavyRain = false;
  const dayConditions = {};

  upcoming.forEach((item) => {
    const temp = item.main.temp;
    if (temp < minTemp) minTemp = temp;
    if (temp > maxTemp) maxTemp = temp;

    const rain = item.rain ? item.rain['3h'] || 0 : 0;
    totalRain += rain;
    if (rain > 5) hasHeavyRain = true;

    const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    if (!dayConditions[dayName]) {
      dayConditions[dayName] = { conditions: [], rain: 0 };
    }
    dayConditions[dayName].conditions.push(item.weather[0].main);
    dayConditions[dayName].rain += rain;
  });

  const daysWithSignificantRain = Object.entries(dayConditions)
    .filter(([, info]) => info.rain > 2)
    .map(([day]) => day);

  const uniqueConditions = [...new Set(upcoming.map((item) => item.weather[0].main))];
  const tempMin = Math.round(minTemp);
  const tempMax = Math.round(maxTemp);
  const location = data.city?.name || 'your area';

  let alert = '';
  let type = 'info';

  if (hasHeavyRain || totalRain > 15) {
    alert = `Heavy rain expected in ${location}: ${tempMin}-${tempMax}°C. `;
    if (daysWithSignificantRain.length > 0) {
      alert += `Heavy showers forecasted ${daysWithSignificantRain.join('-')}. `;
    }
    alert += 'Ensure proper drainage for your crops.';
    type = 'warning';
  } else if (totalRain > 3) {
    alert = `Light rain in ${location}: ${tempMin}-${tempMax}°C. `;
    if (daysWithSignificantRain.length > 0) {
      alert += `Showers expected ${daysWithSignificantRain.join('-')}. `;
    }
    alert += 'Monitor soil moisture levels.';
    type = 'tip';
  } else {
    const conditionText = uniqueConditions.includes('Clear')
      ? 'Clear skies'
      : uniqueConditions.includes('Clouds')
        ? 'Partly cloudy'
        : uniqueConditions.join(', ');
    alert = `${conditionText} in ${location}: ${tempMin}-${tempMax}°C. `;
    alert += 'No significant rain expected. Consider irrigation for dry-season crops.';
    type = 'tip';
  }

  return {
    location,
    alert,
    type,
    tempMin,
    tempMax,
    conditions: uniqueConditions,
    rainExpected: totalRain > 2
  };
};

exports.getWeatherAdvisory = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.json({
        success: true,
        data: {
          location: 'Nairobi',
          alert: 'Weather data unavailable. Provide location or enable geolocation for personalized advisory.',
          type: 'info',
          tempMin: null,
          tempMax: null,
          conditions: [],
          rainExpected: false
        }
      });
    }

    let url = `${OPENWEATHER_URL}?units=metric&appid=${OPENWEATHER_API_KEY}`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `&q=${encodeURIComponent(city)}`;
    }

    const response = await axios.get(url, { timeout: 10000 });
    const advisory = buildAdvisory(response.data);

    res.json({
      success: true,
      data: advisory
    });
  } catch (error) {
    console.error('[weatherController] Failed to fetch weather:', error.message);
    res.json({
      success: true,
      data: {
        location: 'Nairobi',
        alert: 'Weather service temporarily unavailable. Monitor local forecasts for farming decisions.',
        type: 'info',
        tempMin: null,
        tempMax: null,
        conditions: [],
        rainExpected: false
      }
    });
  }
};
