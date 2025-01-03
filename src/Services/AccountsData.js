// ...existing code...
export const dummyAccounts = [
    { id: 1, accountName: 'Cash Wallet', accountType: 'Cash', balance: 1200 },
    { id: 2, accountName: 'Visa', accountType: 'Credit Card', balance: -300 },
    { id: 3, accountName: 'Mastercard', accountType: 'Credit Card', balance: -600 },
    { id: 4, accountName: 'Savings', accountType: 'Debit Card', balance: 3000 },
    { id: 5, accountName: 'Car Loan', accountType: 'Loan', balance: -5000 },
  ];
  
  export function groupAccountsByType(accounts) {
    const grouped = {};
    accounts.forEach((acc) => {
      if (!grouped[acc.accountType]) {
        grouped[acc.accountType] = [];
      }
      grouped[acc.accountType].push(acc);
    });
    return Object.entries(grouped);
  }
  
  function getAssets(accounts) {
    return accounts
      .filter((acc) => acc.balance >= 0)
      .reduce((sum, acc) => sum + acc.balance, 0);
  }
  
  function getLiabilities(accounts) {
    return accounts
      .filter((acc) => acc.balance < 0)
      .reduce((sum, acc) => sum + acc.balance, 0);
  }
  
  export function useAccounts() {
    const accounts = dummyAccounts;
    const groupedAccounts = groupAccountsByType(accounts);
    const assets = getAssets(accounts);
    const liabilities = getLiabilities(accounts); // This will be negative
    const total = assets + liabilities;
    return { groupedAccounts, assets, liabilities, total };
  }