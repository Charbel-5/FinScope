import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { fetchStockPrices } from '../Services/StocksData';
import config from '../Config';
import { useAuth } from './AuthContext';

const StocksContext = createContext();

function StocksProvider({ children }) {
  const [stockHoldings, setStockHoldings] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchHoldings() {
      if (!user) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/user_stocks/${user.userId}`
        );
        setStockHoldings(
          response.data.map((holding) => ({
            ticker: holding.stock_ticker,
            quantity: holding.stock_amount,
          }))
        );
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stock holdings:', err);
        setError('Add your first stock to track its performance');
      } finally {
        setLoading(false);
      }
    }
    fetchHoldings();
  }, [user]);

  useEffect(() => {
    async function updatePrices() {
      if (stockHoldings.length === 0) return;

      setLoading(true);
      try {
        const tickers = stockHoldings.map((h) => h.ticker);
        const prices = await fetchStockPrices(tickers);
        setStockPrices(prices);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stock prices:', err);
        setError('Failed to fetch stock prices');
      } finally {
        setLoading(false);
      }
    }

    updatePrices();
  }, [stockHoldings]);

  function mapHoldingsToPrices() {
    return stockHoldings.map((holding) => {
      const matching = stockPrices.find((p) => p.ticker === holding.ticker);
      const price = matching ? matching.price : 0;
      return {
        ...holding,
        price,
        totalValue: holding.quantity * price,
      };
    });
  }

  function getTotalValue() {
    return mapHoldingsToPrices().reduce((sum, h) => sum + h.totalValue, 0);
  }

  async function addStock(ticker, quantity) {
    try {
      await axios.post(`${config.apiBaseUrl}/api/user_stocks`, {
        stock_ticker: ticker.toUpperCase(),
        stock_amount: Number(parseFloat(quantity).toFixed(5)),
        user_id: user.userId,
      });

      setStockHoldings((prev) => [
        ...prev,
        {
          ticker: ticker.toUpperCase(),
          quantity: Number(parseFloat(quantity).toFixed(5)),
        },
      ]);
    } catch (err) {
      console.error('Failed to add stock:', err);
      throw err;
    }
  }

  async function editStock(oldTicker, newTicker, newQuantity) {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/user_stocks/${user.userId}`
      );
      const stock = response.data.find((s) => s.stock_ticker === oldTicker);

      if (!stock) throw new Error('Stock not found');

      await axios.put(`${config.apiBaseUrl}/api/user_stocks/${stock.stock_id}`, {
        stock_ticker: newTicker.toUpperCase(),
        stock_amount: Number(parseFloat(newQuantity).toFixed(5)),
        user_id: user.userId,
      });

      setStockHoldings((prev) =>
        prev.map((s) =>
          s.ticker === oldTicker
            ? {
                ticker: newTicker.toUpperCase(),
                quantity: Number(parseFloat(newQuantity).toFixed(5)),
              }
            : s
        )
      );
    } catch (err) {
      console.error('Failed to edit stock:', err);
      throw err;
    }
  }

  async function deleteStock(ticker) {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/user_stocks/${user.userId}`
      );
      const stock = response.data.find((s) => s.stock_ticker === ticker);

      if (!stock) throw new Error('Stock not found');

      await axios.delete(`${config.apiBaseUrl}/api/user_stocks/${stock.stock_id}`);
      setStockHoldings((prev) => prev.filter((s) => s.ticker !== ticker));
    } catch (err) {
      console.error('Failed to delete stock:', err);
      throw err;
    }
  }

  return (
    <StocksContext.Provider
      value={{
        stockHoldings,
        stockPrices,
        mapHoldingsToPrices,
        getTotalValue,
        addStock,
        editStock,
        deleteStock,
        loading,
        error,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
}

function useStocks() {
  return useContext(StocksContext);
}

export { useStocks, StocksProvider };