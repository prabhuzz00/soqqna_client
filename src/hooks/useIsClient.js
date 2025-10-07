"use client";

import { useState, useEffect } from "react";

/**
 * Hook to check if code is running on client side
 * Prevents hydration mismatches by returning false during server-side rendering
 * and true only after the component has mounted on the client
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
