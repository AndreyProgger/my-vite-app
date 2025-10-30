import './converter.css'

const API_URL = 'https://api.exchangerate-api.com/v4/latest/RUB';

let exchangeRates = {};

async function loadExchangeRates() {
  const error = document.getElementById('error');
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки курсов валют');
    }
    
    const data = await response.json();
    exchangeRates = data.rates;
    displayRates();
  } catch (err) {
    error.textContent = `Ошибка: ${err.message}. Используются демо-данные.`;
    // Demo данные
    exchangeRates = {
      USD: 0.011,
      EUR: 0.010,
      RUB: 1
    };
    displayRates();
  }
}

function displayRates() {
  const ratesBody = document.getElementById('rates-body');
  const currencies = ['USD', 'EUR', 'RUB'];
  
  ratesBody.innerHTML = currencies
    .filter(currency => currency !== 'RUB')
    .map(currency => `
      <tr>
        <td>${currency}</td>
        <td>${exchangeRates[currency] ? (1 / exchangeRates[currency]).toFixed(2) : 'N/A'}</td>
      </tr>
    `).join('');
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  const resultField = document.getElementById('result');
  
  if (!amount || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    resultField.value = 'Ошибка конвертации';
    return;
  }
  
  // Конвертируем через RUB как базовую валюту
  const amountInRub = fromCurrency === 'RUB' ? amount : amount / exchangeRates[fromCurrency];
  const result = toCurrency === 'RUB' ? amountInRub : amountInRub * exchangeRates[toCurrency];
  
  resultField.value = result.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  loadExchangeRates();
  
  document.getElementById('convert-btn').addEventListener('click', convertCurrency);
  
  // Автоконвертация при изменении значений
  document.getElementById('amount').addEventListener('input', convertCurrency);
  document.getElementById('from-currency').addEventListener('change', convertCurrency);
  document.getElementById('to-currency').addEventListener('change', convertCurrency);
});