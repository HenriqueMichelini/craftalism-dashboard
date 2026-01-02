import { useState, useEffect, useCallback } from "react";
import type { TableState } from "../types/table.types";

export function useTableData<T>(fetchFn: () => Promise<T[]>) {
  const [state, setState] = useState<TableState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      });
    }
  }, [fetchFn]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await fetchFn();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: [],
            loading: false,
            error:
              error instanceof Error ? error.message : "Failed to fetch data",
          });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchFn]);

  return {
    ...state,
    refetch: fetchData,
  };
}
