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

export function useAccounts(userId) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/accounts/${userId}`);
        setAccounts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [userId]);

  const groupedAccounts = groupAccountsByType(accounts);
  const assets = getAssets(accounts);
  const liabilities = getLiabilities(accounts); // This will be negative
  const total = assets + liabilities;

  return { groupedAccounts, assets, liabilities, total, loading, error };
}