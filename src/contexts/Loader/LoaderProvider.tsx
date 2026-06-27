import { useCallback, useMemo, useRef, useState } from "react";
import { LoaderContext } from "./LoaderContext";
import Loader from "../../components/ui/Loader";

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const countRef = useRef(0);

  const showLoader = useCallback(() => {
    countRef.current += 1;
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ loading, showLoader, hideLoader }),
    [loading, showLoader, hideLoader],
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
}
