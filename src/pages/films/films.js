import './films.css'

const API_KEY = 'MXNJ88B-0RQ44HV-QXH6WP6-J3QNVHB'; 
const API_URL = 'https://api.poiskkino.dev/v1.4/movie?page=1&limit=20&lists=top250&year=2010-2023&countries.name=Россия';

async function loadFilms() {
  const container = document.getElementById('films-container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-API-KEY': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }

    const data = await response.json();
    displayFilms(data.docs);
  } catch (err) {
    error.textContent = `Ошибка: ${err.message}`;
    // Для демонстрации покажем mock данные
    displayMockFilms();
  } finally {
    loading.style.display = 'none';
  }
}

function displayFilms(films) {
  const container = document.getElementById('films-container');
  
  films.forEach(film => {
    const filmCard = document.createElement('div');
    filmCard.className = 'film-card';
    
    filmCard.innerHTML = `
      <img src="${film.poster?.previewUrl || 'https://via.placeholder.com/250x300'}" 
           alt="${film.name}" 
           class="film-poster"
           onerror="this.src='https://via.placeholder.com/250x300'">
      <h3 class="film-title">${film.name || film.alternativeName || 'Неизвестно'}</h3>
      <div class="film-info">
        <p>Год: ${film.year || 'Неизвестно'}</p>
        <p>Рейтинг: ${film.rating?.kp ? film.rating.kp.toFixed(1) : 'Н/Д'}</p>
        <p>${film.description ? film.description.substring(0, 100) + '...' : ''}</p>
      </div>
    `;
    
    container.appendChild(filmCard);
  });
}

// Mock данные для демонстрации
function displayMockFilms() {
  const mockFilms = [
    {
      name: "Легенда №17",
      year: 2013,
      rating: { kp: 8.1 },
      description: "История хоккеиста Валерия Харламова"
    },
    {
      name: "Движение вверх",
      year: 2017,
      rating: { kp: 8.0 },
      description: "О победе сборной СССР по баскетболу на Олимпиаде 1972"
    }
  ];

  displayFilms(mockFilms);
}

document.addEventListener('DOMContentLoaded', loadFilms);
