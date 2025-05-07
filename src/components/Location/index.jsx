"use client";
import { useEffect } from "react";

export default function LocationModal({ openkey, setOpenkey }) {
  if (!openkey) return null;

  const handleDetect = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
      setOpenkey(false);
    });
  };

  const handleManualSearch = () => {
    setOpenkey(false);
  };

  return (
    <div className="absolute top-[56px] mt-2 left-3 z-50 bg-white border shadow-md rounded-md w-[500px] p-4">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-md font-semibold">
          Welcome to <span className="text-primary">Sqoone</span>
        </h2>
        <button
          onClick={() => setOpenkey(false)}
          className="text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Please provide your delivery location to see categories near by.
      </p>

      <div className="flex gap-2 items-center">
        <button
          onClick={handleDetect}
          className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Detect My Location
        </button>
        <span className="text-gray-400 text-sm">OR</span>
        <input
          type="text"
          placeholder="Search Box"
          className="border rounded-md px-2 py-2 flex-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
        />
      </div>
    </div>
  );
}
