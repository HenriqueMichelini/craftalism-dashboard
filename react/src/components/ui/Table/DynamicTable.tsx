import type { TableConfig, ColumnDefinition } from "../../../types/table.types.js";
import { LoadingState, ErrorState, EmptyState } from "./TableStates.js";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

type DynamicTableProps<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  config: TableConfig<T>;
  onRetry?: () => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  caption?: string;
  className?: string;
};

export function DynamicTable<T extends Record<string, unknown>>({
  data,
  loading,
  error,
  config,
  onRetry,
  onRowClick,
  emptyMessage = "No data available.",
  caption,
  className = "",
}: DynamicTableProps<T>) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  const getCellValue = (row: T, column: ColumnDefinition<T>): ReactNode => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  };

  const handleRowClick = (
    row: T,
    event: MouseEvent<HTMLTableRowElement>,
  ) => {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest(
        'a, button, input, select, textarea, [role="button"], [data-row-click-ignore="true"]',
      )
    ) {
      return;
    }

    onRowClick?.(row);
  };

  const handleRowKeyDown = (
    row: T,
    event: KeyboardEvent<HTMLTableRowElement>,
  ) => {
    if (!onRowClick || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    onRowClick(row);
  };

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-primary-400 ${className}`}
    >
      <table aria-busy={loading} className="w-full border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-primary-400">
          <tr>
            {config.columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
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
              className={`transition-colors hover:bg-primary-400/60 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={(event) => handleRowClick(row, event)}
              onKeyDown={(event) => handleRowKeyDown(row, event)}
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
