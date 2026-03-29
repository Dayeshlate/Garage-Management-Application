import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

interface CurrencyConfig {
  symbol: string;
  code: string;
}

const currencyMap: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', code: 'USD' },
  EUR: { symbol: '€', code: 'EUR' },
  GBP: { symbol: '£', code: 'GBP' },
  INR: { symbol: '₹', code: 'INR' },
};

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('garage_theme');
    return (stored as Theme) || 'light';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem('garage_currency');
    return (stored as Currency) || 'USD';
  });

  const [taxRate, setTaxRateState] = useState<number>(() => {
    const stored = localStorage.getItem('garage_tax_rate');
    return stored ? parseFloat(stored) : 12;
  });

  useEffect(() => {
    localStorage.setItem('garage_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('garage_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('garage_tax_rate', String(taxRate));
  }, [taxRate]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setTaxRate = (r: number) => setTaxRateState(r);

  const formatCurrency = (amount: number) => {
    const config = currencyMap[currency];
    return `${config.symbol}${amount.toLocaleString()}`;
  };

  const currencySymbol = currencyMap[currency].symbol;

  return (
    <SettingsContext.Provider value={{ theme, setTheme, currency, setCurrency, taxRate, setTaxRate, formatCurrency, currencySymbol }}>
      {children}
    </SettingsContext.Provider>
  );
};
