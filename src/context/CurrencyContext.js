"use client";
// context/CurrencyContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1 });

  useEffect(() => {
    const storedCurrency = Cookies.get("currency") || "USD";
    setCurrency(storedCurrency);
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/currency-rates"); // Or use a Next.js API route
      const data = await res.json();
      setRates(data.rates || {});
    } catch (error) {
      console.error("Failed to fetch currency rates", error);
    }
  };

  const changeCurrency = (newCurrency) => {
    Cookies.set("currency", newCurrency, { expires: 7 });
    setCurrency(newCurrency);
  };

  const convertPrice = (usdAmount) => {
    const rate = rates[currency] || 1;
    return (usdAmount * rate).toFixed(2);
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

  return (
    <CurrencyContext.Provider
      value={{ currency, changeCurrency, convertPrice, getSymbol }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
