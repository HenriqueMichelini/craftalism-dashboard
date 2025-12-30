import { useState, useEffect } from "react";
import { api, type TableRow } from "../api/api";

type UseTableDataReturn = {
  data: TableRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useTableData(): UseTableDataReturn {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getTableData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
