import type { TableState } from "../types/table.types";

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to fetch data";
}

export async function loadTableData<T>(
  fetchFn: () => Promise<T[]>,
): Promise<TableState<T>> {
  try {
    const data = await fetchFn();
    return { data, loading: false, error: null };
  } catch (error) {
    return {
      data: [],
      loading: false,
      error: toErrorMessage(error),
    };
  }
}
