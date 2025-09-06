// components/ScriptLoader.js (alternative version)
"use client";

import Script from 'next/script';

const ScriptLoader = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=beta&callback=initMap`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Google Maps script loaded successfully');
          }}
          onError={(e) => {
            console.error('Google Maps script failed to load', e);
          }}
        />
      )}
    </>
  );
};

export default ScriptLoader;