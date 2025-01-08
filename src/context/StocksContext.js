import { createContext, useContext, useState } from 'react';

const StocksContext = createContext();

function StocksProvider({ children }) {
  // Example data arrays
  const [stockHoldings, setStockHoldings] = useState([
    { ticker: 'AAPL', quantity: 10 },
    { ticker: 'TSLA', quantity: 5 },
  ]);

  const [stockPrices, setStockPrices] = useState([
    { ticker: 'AAPL', price: 175 },
    { ticker: 'TSLA', price: 200 },
    { ticker: 'MSFT', price: 310 },
  ]);

  // Maps holdings to prices by ticker
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

  // Calculates total portfolio value
  function getTotalValue() {
    return mapHoldingsToPrices().reduce((sum, h) => sum + h.totalValue, 0);
  }

  // Adds a new holding
  function addStock(ticker, quantity) {
    setStockHoldings((prev) => [...prev, { ticker, quantity: parseFloat(quantity) }]);
  }

  return (
    <StocksContext.Provider
      value={{
        stockHoldings,
        stockPrices,
        mapHoldingsToPrices,
        getTotalValue,
        addStock,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
}

// Hook to use the context
function useStocks() {
  return useContext(StocksContext);
}

export { useStocks, StocksProvider };