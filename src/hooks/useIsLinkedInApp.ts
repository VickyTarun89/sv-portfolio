import { useState, useEffect } from "react";

export const useIsLinkedInApp = () => {
  const [isLinkedIn, setIsLinkedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // LinkedIn app user agent string usually contains specific keywords
    const isLinkedInWebView = 
      userAgent.includes("LinkedInApp") || 
      userAgent.includes("LinkedIn");

    setIsLinkedIn(!!isLinkedInWebView);
  }, []);

  return isLinkedIn;
};
