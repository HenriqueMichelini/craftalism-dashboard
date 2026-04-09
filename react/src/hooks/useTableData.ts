import { useState, useEffect, useCallback } from "react";
import type { TableState } from "../types/table.types.js";
import { loadTableData } from "./tableDataState.js";

export { loadTableData } from "./tableDataState.js";

export function useTableData<T>(fetchFn: () => Promise<T[]>) {
  const [state, setState] = useState<TableState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const nextState = await loadTableData(fetchFn);
    setState(nextState);
  }, [fetchFn]);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      const nextState = await loadTableData(fetchFn);

      if (!cancelled) {
        setState(nextState);
      }
    };

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [fetchFn]);

  return {
    ...state,
    refetch: fetchData,
  };
}
