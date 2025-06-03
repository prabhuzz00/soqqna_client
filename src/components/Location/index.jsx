"use client";

import { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { MyContext } from "@/context/ThemeProvider";
import { MdClose } from "react-icons/md";

export default function LocationModal({ openkey, setOpenkey }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();
  const { setUserLocation } = useContext(MyContext);

  if (!openkey) return null;

  const handleDetect = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const fallback = `Lat: ${latitude}, Lon: ${longitude}`;
      try {
        const geoRes = await fetch(
          `/api/geocode?lat=${latitude}&lng=${longitude}`
        );
        const geoData = await geoRes.json();
        console.log("Detected address:", geoData);
        const strGeoData = JSON.stringify(geoData);
        setUserLocation(geoData.address.city);
        if (session?.user?.id) {
          await saveAddress(strGeoData, session.user.id);
        } else {
          localStorage.setItem("userLocation", strGeoData);
        }
      } catch {
        setUserLocation(fallback);
        if (!session?.user?.id) {
          localStorage.setItem("userLocation", fallback);
        }
      }
      setOpenkey(false);
    });
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `/api/autocomplete?input=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSelectSuggestion = async (s) => {
    setSearchQuery(s.description);
    setSuggestions([]);

    try {
      const geoRes = await fetch(`/api/geocode?place_id=${s.place_id}`);
      const geoData = await geoRes.json();
      const strGeoData = JSON.stringify(geoData);
      setUserLocation(geoData.address.city);

      if (session?.user?.id) {
        await saveAddress(strGeoData, session.user.id);
      } else {
        localStorage.setItem("userLocation", strGeoData);
      }
    } catch (err) {
      console.error("Geocode by place_id error:", err);
    }

    setOpenkey(false);
  };

  const handleManualSearch = () => {
    if (!searchQuery.trim()) return;

    // fallback to geocode address text
    handleSelectSuggestion({ description: searchQuery.trim(), place_id: "" });
  };

  const saveAddress = async (geoData, userId) => {
    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, geoData }),
      });
      if (!res.ok) throw new Error(await res.text());
      console.log("Saved");
    } catch (err) {
      console.error("Save address failed:", err);
    }
  };

  return (
    <div className="absolute top-[60px] lg:top-[80px] w-[95%] lg:w-auto left-[2.5%] lg:left-[30px] z-[100] shadow-md  p-4 bg-white border border-[rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-md font-semibold">
          Welcome to <span className="text-primary">Soouqna</span>
        </h2>
        <button
          onClick={() => setOpenkey(false)}
          className="text-gray-500 hover:text-black text-xl"
        >
          <MdClose size={20}/>
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Please provide your delivery location to see categories nearby.
      </p>
      <div className="flex gap-2  flex-col sm:flex-row items-stretch sm:items-center">
        <button
          onClick={handleDetect}
          className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Detect My Location
        </button>
        <span className="text-gray-400 text-sm text-center sm:text-left">
          OR
        </span>
        <input
          type="text"
          placeholder="Search city or address..."
          className="border rounded-md px-2 py-2 flex-1 text-sm focus:border-[rgba(0,0,0,0.4)] outline-none"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="p-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
