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

const resolveDefaultCurrency = (): Currency => {
  const envCurrency = String(import.meta.env.VITE_DEFAULT_CURRENCY || '').toUpperCase();
  if (envCurrency in currencyMap) {
    return envCurrency as Currency;
  }
  return 'USD';
};

const DEFAULT_CURRENCY = resolveDefaultCurrency();

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
  initializeFromUser: (userCurrency?: string, userTaxRate?: number) => void;
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
    if (stored && stored in currencyMap) {
      return stored as Currency;
    }
    return DEFAULT_CURRENCY;
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

  const initializeFromUser = (userCurrency?: string, userTaxRate?: number) => {
    const storedCurrency = localStorage.getItem('garage_currency');
    if (!storedCurrency && userCurrency && (userCurrency in currencyMap)) {
      setCurrencyState(userCurrency as Currency);
    }
    if (!storedCurrency && !userCurrency) {
      setCurrencyState(DEFAULT_CURRENCY);
    }
    if (userTaxRate !== undefined && userTaxRate !== null) {
      setTaxRateState(userTaxRate);
    }
  };

  const formatCurrency = (amount: number) => {
    const config = currencyMap[currency];
    return `${config.symbol}${amount.toLocaleString()}`;
  };

  const currencySymbol = currencyMap[currency].symbol;

  return (
    <SettingsContext.Provider value={{ theme, setTheme, currency, setCurrency, taxRate, setTaxRate, formatCurrency, currencySymbol, initializeFromUser }}>
      {children}
    </SettingsContext.Provider>
  );
};
