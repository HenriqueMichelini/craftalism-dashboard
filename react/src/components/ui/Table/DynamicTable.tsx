import { TableConfig } from "../../../types/table.types";
import { LoadingState, ErrorState, EmptyState } from "./TableStates";

type DynamicTableProps<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  config: TableConfig<T>;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
};

export function DynamicTable<T extends Record<string, any>>({
  data,
  loading,
  error,
  config,
  onRetry,
  emptyMessage = "No data available.",
  className = "",
}: DynamicTableProps<T>) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  const getCellValue = (row: T, column: any) => {
    const value = row[column.key as keyof T];
    return column.render ? column.render(value, row) : value;
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-primary-400 ${className}`}
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-primary-400">
          <tr>
            {config.columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${
                  column.className || ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-400 bg-primary-500">
          {data.map((row) => (
            <tr
              key={String(row[config.rowKey])}
              className="transition-colors hover:bg-primary-400/60"
            >
              {config.columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-4 py-3 ${column.className || ""}`}
                >
                  {getCellValue(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
