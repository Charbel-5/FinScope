import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../Config';

export async function createAccount(account) {
  await axios.post(`${config.apiBaseUrl}/api/accounts`, account);
}

export async function updateAccount(id, account) {
  await axios.put(`${config.apiBaseUrl}/api/accounts/${id}`, account);
}

export async function deleteAccount(id) {
  await axios.delete(`${config.apiBaseUrl}/api/accounts/${id}`);
}

export function groupAccountsByType(accounts) {
  const grouped = {};
  accounts.forEach((acc) => {
    if (!grouped[acc.account_type_description]) {
      grouped[acc.account_type_description] = [];
    }
    grouped[acc.account_type_description].push(acc);
  });
  return Object.entries(grouped);
}

function getAssets(accounts) {
  return accounts
    .filter((acc) => Number(acc.total_amount) >= 0)
    .reduce((sum, acc) => sum + Number(acc.total_amount), 0);
}

function getLiabilities(accounts) {
  return accounts
    .filter((acc) => Number(acc.total_amount) < 0)
    .reduce((sum, acc) => sum + Number(acc.total_amount), 0);
}

function getAssetsInPrimaryCurrency(accounts, conversionRate) {
  return accounts
    .filter((acc) => Number(acc.total_amount) >= 0)
    .reduce((sum, acc) => {
      // If account is in secondary currency, convert to primary
      const amount = Number(acc.total_amount);
      return sum + (acc.currency_symbol === acc.primary_currency_symbol 
        ? amount 
        : amount * conversionRate);
    }, 0);
}

function getLiabilitiesInPrimaryCurrency(accounts, conversionRate) {
  return accounts
    .filter((acc) => Number(acc.total_amount) < 0)
    .reduce((sum, acc) => {
      // If account is in secondary currency, convert to primary
      const amount = Number(acc.total_amount);
      return sum + (acc.currency_symbol === acc.primary_currency_symbol 
        ? amount 
        : amount * conversionRate);
    }, 0);
}

export function useAccounts(userId) {
  const [accounts, setAccounts] = useState([]);
  const [primaryCurrencySymbol, setPrimaryCurrencySymbol] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch accounts
        const accountsRes = await axios.get(`${config.apiBaseUrl}/api/accounts/${userId}`);
        setAccounts(accountsRes.data);

        // Fetch user's currency info and latest rate
        const userAttrsRes = await axios.get(`${config.apiBaseUrl}/api/complex/userAttributes/${userId}`);
        const userAttrs = userAttrsRes.data;
        setPrimaryCurrencySymbol(userAttrs.primary_currency_symbol);
        setConversionRate(userAttrs.latest_rate || 1);
        
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const groupedAccounts = groupAccountsByType(accounts);
  const assets = getAssetsInPrimaryCurrency(accounts, conversionRate);
  const liabilities = getLiabilitiesInPrimaryCurrency(accounts, conversionRate);
  const total = assets + liabilities;

  return { 
    groupedAccounts, 
    assets, 
    liabilities, 
    total, 
    loading, 
    error, 
    primaryCurrencySymbol 
  };
}