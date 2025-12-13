import { useEffect, useState } from "react";
import useAppStore from "@/lib/store-persist";

// Custom hook that forces updates when store changes
export const useRealtimeStore = (selector) => {
  const [state, setState] = useState(() => selector(useAppStore.getState()));

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((newState) => {
      const newSelectedState = selector(newState);
      setState(newSelectedState);
    });

    return () => unsubscribe();
  }, [selector]);

  return state;
};
