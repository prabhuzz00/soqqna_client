"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LocationModal({ openkey, setOpenkey }) {
  const [fullAddress, setFullAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    // Load address from local storage if user is not authenticated
    if (!session?.user?.id) {
      const cachedAddress = localStorage.getItem("userLocation");
      if (cachedAddress) {
        setFullAddress(cachedAddress);
        console.log("Cached address loaded from local storage:", cachedAddress);
      }
    }
  }, [session]);

  if (!openkey) return null;

  const handleDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const apiKey = "AIzaSyDZAL1JS9LDHvpykfoc0FY5nITc7aSuYlE"; 
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
          const geoResponse = await fetch(geocodingUrl);
          const geoData = await geoResponse.json();

          if (geoData.results && geoData.results.length > 0) {
            const detectedAddress = geoData.results[0].formatted_address;
            setFullAddress(detectedAddress);

            if (session?.user?.id) {
              // Save the detected address using the API if authenticated
              await saveAddress(detectedAddress, session.user.id);
            } else {
              // Store in local storage if not authenticated
              localStorage.setItem("userLocation", detectedAddress);
              console.log("Address cached in local storage.");
            }
          } else {
            console.error("No geocoding results found.");
            const detectedAddress = `Lat: ${latitude}, Lon: ${longitude}`;
            setFullAddress(detectedAddress); // Fallback to coordinates
             if (session?.user?.id) {
              await saveAddress(detectedAddress, session.user.id);
            } else {
              localStorage.setItem("userLocation", detectedAddress);
            }
          }
        } catch (geoError) {
          console.error("Error during reverse geocoding:", geoError);
           const detectedAddress = `Lat: ${latitude}, Lon: ${longitude}`;
           setFullAddress(detectedAddress); // Fallback to coordinates
            if (session?.user?.id) {
              await saveAddress(detectedAddress, session.user.id);
            } else {
              localStorage.setItem("userLocation", detectedAddress);
            }
        }

        setOpenkey(false);
      }, (error) => {
        console.error("Error detecting location:", error);
        // Handle errors, e.g., show a message to the user
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle case where geolocation is not supported
    }
  };

  const handleManualSearch = async () => {
    if (searchQuery.trim()) {
      const enteredAddress = searchQuery.trim();
      setFullAddress(enteredAddress);

      if (session?.user?.id) {
        // Save the manually entered address using the API if authenticated
        await saveAddress(enteredAddress, session.user.id);
      } else {
        // Store in local storage if not authenticated
        localStorage.setItem("userLocation", enteredAddress);
        console.log("Address cached in local storage.");
      }

      setOpenkey(false);
    }
  };

  const saveAddress = async (address, userId) => {
    try {
      const response = await fetch("/api/user/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, address }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Address saved successfully:", data.message);
        // Optionally show a success message to the user
      } else {
        console.error("Error saving address:", data.message);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error saving address:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="absolute top-[56px] mt-2 left-3 z-50 bg-white border shadow-md rounded-md w-[500px] p-4">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-md font-semibold">
          Welcome to <span className="text-primary">Sooqna</span>
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
        />
      </div>

      {fullAddress && (
        <div className="mt-4 text-sm text-gray-700">
          <strong>Detected Location:</strong> {fullAddress}
        </div>
      )}
    </div>
  );
}
