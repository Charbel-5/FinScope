import { restClient } from '@polygon.io/client-js';
import config from '../Config';

const rest = restClient(config.polygonApiKey);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function getPreviousBusinessDay() {
  let date = new Date();

  const day = date.getDay();
  if (day === 0) {
    // Sunday
    date.setDate(date.getDate() - 2);
  } else if (day === 6) {
    // Saturday
    date.setDate(date.getDate() - 1);
  } else {
    date.setDate(date.getDate() - 1);
  }

  return date.toISOString().split('T')[0];
  
}

export async function fetchStockPrices(tickers) {
  if (!tickers || tickers.length === 0) return [];
  
  let attempts = 0;
  const maxAttempts = 5;
  const retryDelay = 1000;
  const date = getPreviousBusinessDay();

  while (attempts < maxAttempts) {
    try {
      console.log(`Fetching stock prices for date: ${date} and tickers: ${tickers}`);

      const response = await rest.stocks.aggregatesGroupedDaily(date);
      console.log('Full API response:', response);

      if (!response.results || response.results.length === 0) {
        throw new Error('No results from Polygon API');
      }

      const filteredPrices = response.results
        .filter(stock => tickers.includes(stock.T))
        .map(stock => ({
          ticker: stock.T,
          price: stock.c
        }));

      console.log('Filtered prices:', filteredPrices);
      return filteredPrices;

    } catch (e) {
      if (e.status === 429) {
        console.warn('Rate limit exceeded, retrying...');
        attempts++;
        await delay(retryDelay);
      } else {
        console.error('Error fetching stock prices:', e);
        throw e;
      }
    }
  }

  throw new Error('Max retry attempts reached');
}