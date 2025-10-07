"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { MyContext } from "@/context/ThemeProvider";

/**
 * Custom hook to handle authentication redirects
 * Prevents premature redirects on page reload by checking token first
 */
export const useAuthRedirect = (redirectTo = "/login") => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const context = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    let timeoutId;

    const checkAuth = () => {
      const token = Cookies.get("accessToken");

      // If no token, redirect immediately
      if (!token) {
        router.push(redirectTo);
        return;
      }

      // If context hasn't loaded yet, wait a bit more
      if (context?.isLogin === undefined) {
        timeoutId = setTimeout(() => {
          // If still undefined after timeout, assume not logged in
          if (context?.isLogin === undefined) {
            setIsCheckingAuth(false);
          }
        }, 2000); // Wait max 2 seconds for context to load
        return;
      }

      // Context has loaded
      if (context.isLogin === false) {
        router.push(redirectTo);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [context?.isLogin, router, redirectTo]);

  return { isCheckingAuth, isLoggedIn: context?.isLogin };
};
