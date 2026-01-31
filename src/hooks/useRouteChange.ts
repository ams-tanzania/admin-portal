import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteChange = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 5000); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return isNavigating;
};