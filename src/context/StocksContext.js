import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { fetchStockPrices } from '../Services/StocksData';
import { useAuth } from './AuthContext';

const StocksContext = createContext();

function StocksProvider({ children }) {
  const [stockHoldings, setStockHoldings] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth(); // Add this line

  // Fetch holdings from database
  useEffect(() => {
    async function fetchHoldings() {
      if (!user) return; // Add this check
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`/api/user_stocks/${user.userId}`);
        setStockHoldings(response.data.map(holding => ({
          ticker: holding.stock_ticker,
          quantity: holding.stock_amount
        })));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stock holdings:', err);
        setError('Add your first stock to track its performance'); // Changed error message
      } finally {
        setLoading(false); // Stop loading regardless of result
      }
    }
    fetchHoldings();
  }, [user]); // Update dependency

  // Fetch prices whenever holdings change
  useEffect(() => {
    async function updatePrices() {
      if (stockHoldings.length === 0) return;
      
      setLoading(true);
      try {
        const tickers = stockHoldings.map(h => h.ticker);
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
      // First check if user already owns this stock
      const response = await axios.get(`/api/user_stocks/${user.userId}`);
      const existingStock = response.data.find(
        s => s.stock_ticker.toUpperCase() === ticker.toUpperCase()
      );
      
      if (existingStock) {
        // If stock exists, update its quantity instead
        const newQuantity = parseFloat(existingStock.stock_amount) + parseFloat(quantity);
        await axios.put(`/api/user_stocks/${existingStock.stock_id}`, {
          stock_ticker: ticker.toUpperCase(),
          stock_amount: newQuantity,
          user_id: user.userId
        });
        
        setStockHoldings(prev => 
          prev.map(s => 
            s.ticker === ticker.toUpperCase()
              ? { ...s, quantity: newQuantity }
              : s
          )
        );
      } else {
        // If stock doesn't exist, create new entry
        await axios.post('/api/user_stocks', {
          stock_ticker: ticker.toUpperCase(),
          stock_amount: parseFloat(quantity),
          user_id: user.userId
        });
        
        setStockHoldings(prev => [...prev, {
          ticker: ticker.toUpperCase(),
          quantity: parseFloat(quantity)
        }]);
      }
    } catch (err) {
      console.error('Failed to add stock:', err);
      throw err;
    }
  }

  async function editStock(oldTicker, newTicker, newQuantity) {  
    try {
      // Find the stock_id first
      const response = await axios.get(`/api/user_stocks/${user.userId}`);
      const stock = response.data.find(s => s.stock_ticker === oldTicker);
      
      if (!stock) throw new Error('Stock not found');

      await axios.put(`/api/user_stocks/${stock.stock_id}`, {
        stock_ticker: newTicker.toUpperCase(),
        stock_amount: parseFloat(newQuantity),
        user_id: user.userId
      });

      setStockHoldings(prev => 
        prev.map(s => 
          s.ticker === oldTicker 
            ? { ticker: newTicker.toUpperCase(), quantity: parseFloat(newQuantity) } 
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
      const response = await axios.get(`/api/user_stocks/${user.userId}`);
      const stock = response.data.find(s => s.stock_ticker === ticker);
      
      if (!stock) throw new Error('Stock not found');

      await axios.delete(`/api/user_stocks/${stock.stock_id}`);
      setStockHoldings(prev => prev.filter(s => s.ticker !== ticker));
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
        error
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