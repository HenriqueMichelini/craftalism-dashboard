import { useState, useEffect } from "react";

type TableRow = {
  uuid: string;
  name: string;
  created_at: string;
};

type TableState = {
  data: TableRow[];
  loading: boolean;
  error: string | null;
};

function Table() {
  const [state, setState] = useState<TableState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("http://localhost:8080/api/players");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TableRow[] = await response.json();

      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-primary-400 bg-primary-500 p-12">
        <div className="text-center">
          <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-400 border-t-default"></div>
          <p className="text-muted">Loading data...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-500/10 p-6">
        <p className="text-red-400">Error: {state.error}</p>
        <button
          onClick={fetchTableData}
          className="mt-4 rounded-md bg-primary-400 px-4 py-2 text-sm font-medium text-default hover:bg-primary-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
      <div className="flex justify-center items-center text-center">
        <h3>No data available.</h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary-400">
      <table className="w-full border-collapse text-left">
        <thead className="bg-primary-400">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              UUID
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Name
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Created at
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-primary-400 bg-primary-500">
          {state.data.map((row) => (
            <tr
              key={row.uuid}
              className="transition-colors hover:bg-primary-400/60"
            >
              <td className="px-4 py-3 font-mono text-sm text-default">
                {row.uuid}
              </td>
              <td className="px-4 py-3 font-medium text-default">{row.name}</td>
              <td className="px-4 py-3 text-sm text-muted">
                {formatDate(row.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
