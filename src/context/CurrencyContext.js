"use client";
// context/CurrencyContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCurrency = Cookies.get("currency") || "USD";
    setCurrency(storedCurrency);
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      // Add query parameter to get client-formatted response
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/currency-rates?format=client`);
      const data = await res.json();
      console.log("currency rate ", data);

      if (data.success && data.rates) {
        setRates(data.rates);
      } else {
        // Fallback to default rates if API fails
        setRates({ USD: 1 });
        console.warn("Failed to fetch rates, using default USD rate");
      }
    } catch (error) {
      console.error("Failed to fetch currency rates", error);
      // Fallback to default rates
      setRates({ USD: 1 });
    } finally {
      setLoading(false);
    }
  };

  const changeCurrency = (newCurrency) => {
    Cookies.set("currency", newCurrency, { expires: 7 });
    setCurrency(newCurrency);
  };

  const convertPrice = (usdAmount) => {
    // Convert to number and validate
    const numAmount = parseFloat(usdAmount);

    // Handle invalid inputs
    if (isNaN(numAmount) || numAmount < 0) {
      return "0.00";
    }

    // Handle loading state
    if (loading) return numAmount.toFixed(2);

    const rate = rates[currency] || 1;
    return (numAmount * rate).toFixed(2);
  };

  const getSymbol = (code = currency) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      SAR: "ر.س",
      AED: "د.إ",
      QAR: "ر.ق",
      BHD: "د.ب",
      KWD: "د.ك",
      SYP: "£",
    };
    return symbols[code] || code;
  };

  // Helper function to get available currencies
  const getAvailableCurrencies = () => {
    return Object.keys(rates).map((code) => ({
      code,
      symbol: getSymbol(code),
      rate: rates[code],
    }));
  };

  // Helper function to refresh rates (useful for admin updates)
  const refreshRates = () => {
    fetchRates();
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        convertPrice,
        getSymbol,
        rates,
        loading,
        getAvailableCurrencies,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);