"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useAppStore from "@/lib/store-persist";

// Create context for the store
const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Get the entire store
  const store = useAppStore();

  // Add a state to force updates when store changes
  const [storeVersion, setStoreVersion] = useState(0);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state) => {
      // Increment version to force re-renders
      setStoreVersion((v) => v + 1);
    });

    return () => unsubscribe();
  }, []);

  return (
    <StoreContext.Provider value={{ store, storeVersion }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
