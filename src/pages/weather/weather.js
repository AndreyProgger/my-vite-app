import './weather.css'

// Российский источник погоды - используем Open-Meteo API с данными для России
const LATITUDE = 56.3269  // Широта Нижнего Новгорода
const LONGITUDE = 44.0065 // Долгота Нижнего Новгорода

// URL для текущей погоды и прогноза
const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Moscow&forecast_days=5`

async function loadWeather() {
  const loading = document.getElementById('loading')
  const weatherCard = document.getElementById('weather-card')
  const forecast = document.getElementById('forecast')
  const error = document.getElementById('error')

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных о погоде')
    }

    const data = await response.json()

    displayCurrentWeather(data)
    displayForecast(data)
    updateLastUpdate()

    loading.style.display = 'none'
    weatherCard.style.display = 'block'
    forecast.style.display = 'block'
    error.textContent = ''

  } catch (err) {
    error.textContent = `Ошибка: ${err.message}. Используются демо-данные.`
    displayMockWeather()
    loading.style.display = 'none'
  }
}

function displayCurrentWeather(data) {
  const current = data.current
  
  document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°`
  document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°`
  document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`
  document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} гПа`
  document.getElementById('wind-speed').textContent = `${current.wind_speed_10m} м/с`
  
  // Получаем описание погоды по коду
  const weatherInfo = getWeatherInfo(current.weather_code)
  document.getElementById('weather-description').textContent = weatherInfo.description

  // Устанавливаем иконку погоды
  document.getElementById('weather-icon').src = weatherInfo.icon
  document.getElementById('weather-icon').alt = weatherInfo.description

  // Скрываем visibility, так как в этом API его нет
  document.getElementById('visibility').style.display = 'none'
}

function displayForecast(data) {
  const forecastList = document.getElementById('forecast-list')
  const daily = data.daily

  forecastList.innerHTML = daily.time.map((date, index) => {
    const weatherInfo = getWeatherInfo(daily.weather_code[index])
    return `
      <div class="forecast-day">
        <div class="forecast-date">${formatDate(date)}</div>
        <div class="forecast-icon">
          <img src="${weatherInfo.icon}" alt="${weatherInfo.description}">
        </div>
        <div class="forecast-temp">${Math.round(daily.temperature_2m_max[index])}°</div>
        <div class="forecast-description">${weatherInfo.description}</div>
        <div class="forecast-details">
          <small>📈 ${Math.round(daily.temperature_2m_max[index])}°</small>
          <small>📉 ${Math.round(daily.temperature_2m_min[index])}°</small>
        </div>
      </div>
    `
  }).join('')
}

// Функция для получения описания и иконки погоды по коду WMO
function getWeatherInfo(weatherCode) {
  const weatherMap = {
    0: {
      description: 'Ясно',
      icon: 'https://open-meteo.com/images/weather-icon/clear.svg'
    },
    1: {
      description: 'Преимущественно ясно',
      icon: 'https://open-meteo.com/images/weather-icon/partly-cloudy.svg'
    },
    2: {
      description: 'Переменная облачность',
      icon: 'https://open-meteo.com/images/weather-icon/cloudy.svg'
    },
    3: {
      description: 'Пасмурно',
      icon: 'https://open-meteo.com/images/weather-icon/overcast.svg'
    },
    45: {
      description: 'Туман',
      icon: 'https://open-meteo.com/images/weather-icon/fog.svg'
    },
    48: {
      description: 'Туман с инеем',
      icon: 'https://open-meteo.com/images/weather-icon/fog.svg'
    },
    51: {
      description: 'Легкая морось',
      icon: 'https://open-meteo.com/images/weather-icon/drizzle.svg'
    },
    53: {
      description: 'Умеренная морось',
      icon: 'https://open-meteo.com/images/weather-icon/drizzle.svg'
    },
    55: {
      description: 'Сильная морось',
      icon: 'https://open-meteo.com/images/weather-icon/drizzle.svg'
    },
    61: {
      description: 'Небольшой дождь',
      icon: 'https://open-meteo.com/images/weather-icon/rain.svg'
    },
    63: {
      description: 'Умеренный дождь',
      icon: 'https://open-meteo.com/images/weather-icon/rain.svg'
    },
    65: {
      description: 'Сильный дождь',
      icon: 'https://open-meteo.com/images/weather-icon/heavy-rain.svg'
    },
    71: {
      description: 'Небольшой снег',
      icon: 'https://open-meteo.com/images/weather-icon/snow.svg'
    },
    73: {
      description: 'Умеренный снег',
      icon: 'https://open-meteo.com/images/weather-icon/snow.svg'
    },
    75: {
      description: 'Сильный снег',
      icon: 'https://open-meteo.com/images/weather-icon/heavy-snow.svg'
    },
    77: {
      description: 'Снежные зерна',
      icon: 'https://open-meteo.com/images/weather-icon/snow.svg'
    },
    80: {
      description: 'Небольшие ливни',
      icon: 'https://open-meteo.com/images/weather-icon/showers.svg'
    },
    81: {
      description: 'Умеренные ливни',
      icon: 'https://open-meteo.com/images/weather-icon/showers.svg'
    },
    82: {
      description: 'Сильные ливни',
      icon: 'https://open-meteo.com/images/weather-icon/heavy-showers.svg'
    },
    85: {
      description: 'Небольшой снегопад',
      icon: 'https://open-meteo.com/images/weather-icon/snow-showers.svg'
    },
    86: {
      description: 'Сильный снегопад',
      icon: 'https://open-meteo.com/images/weather-icon/snow-showers.svg'
    },
    95: {
      description: 'Гроза',
      icon: 'https://open-meteo.com/images/weather-icon/thunderstorm.svg'
    },
    96: {
      description: 'Гроза с градом',
      icon: 'https://open-meteo.com/images/weather-icon/thunderstorm.svg'
    },
    99: {
      description: 'Сильная гроза с градом',
      icon: 'https://open-meteo.com/images/weather-icon/thunderstorm.svg'
    }
  }

  return weatherMap[weatherCode] || {
    description: 'Неизвестно',
    icon: 'https://open-meteo.com/images/weather-icon/not-available.svg'
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  }
  return date.toLocaleDateString('ru-RU', options)
}

function updateLastUpdate() {
  const now = new Date()
  const lastUpdate = document.getElementById('last-update')
  lastUpdate.textContent = `Последнее обновление: ${now.toLocaleString('ru-RU')}`
}

// Mock данные для демонстрации (актуальные для Нижнего Новгорода)
function displayMockWeather() {
  const mockData = {
    current: {
      temperature_2m: 12,
      apparent_temperature: 10,
      relative_humidity_2m: 78,
      pressure_msl: 1012,
      wind_speed_10m: 3.2,
      weather_code: 2
    },
    daily: {
      time: [
        '2024-01-20',
        '2024-01-21', 
        '2024-01-22',
        '2024-01-23',
        '2024-01-24'
      ],
      temperature_2m_max: [12, 8, 5, 7, 10],
      temperature_2m_min: [3, 1, -2, 0, 2],
      weather_code: [2, 3, 71, 61, 1]
    }
  }

  displayCurrentWeather(mockData)
  displayForecast(mockData)
  updateLastUpdate()

  document.getElementById('weather-card').style.display = 'block'
  document.getElementById('forecast').style.display = 'block'
}

document.addEventListener('DOMContentLoaded', () => {
  loadWeather()

  // Обновление по кнопке
  document.getElementById('refresh-btn').addEventListener('click', () => {
    const btn = document.getElementById('refresh-btn')
    btn.disabled = true
    btn.textContent = 'Обновление...'
    
    loadWeather()
    
    setTimeout(() => {
      btn.disabled = false
      btn.textContent = 'Обновить данные'
    }, 2000)
  })

  // Автообновление каждые 30 минут
  setInterval(loadWeather, 30 * 60 * 1000)
})