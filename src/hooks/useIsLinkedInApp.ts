import { useState, useEffect } from "react";

const checkLinkedIn = () => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // LinkedIn app user agent string checks
  return !!(
    userAgent.includes("LinkedInApp") || 
    userAgent.includes("LinkedIn")
  );
};

export const useIsLinkedInApp = () => {
  // Initialize state synchronously from the User Agent
  const [isLinkedIn, setIsLinkedIn] = useState(checkLinkedIn);

  useEffect(() => {
    // Re-verify in case of hydration or late updates
    const current = checkLinkedIn();
    if (current !== isLinkedIn) {
      setIsLinkedIn(current);
    }
  }, [isLinkedIn]);

  return isLinkedIn;
};
