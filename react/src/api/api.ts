const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}

// API methods
export const api = {
  getTableData: () => fetchApi<TableRow[]>("/api/players"),

  // // Add more endpoints as needed
  // createItem: (data: Partial<TableRow>) =>
  //   fetchApi<TableRow>("/api/your-endpoint", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   }),

  // updateItem: (uuid: string, data: Partial<TableRow>) =>
  //   fetchApi<TableRow>(`/api/your-endpoint/${uuid}`, {
  //     method: "PUT",
  //     body: JSON.stringify(data),
  //   }),

  // deleteItem: (uuid: string) =>
  //   fetchApi<void>(`/api/your-endpoint/${uuid}`, {
  //     method: "DELETE",
  //   }),
};

// Types
export type TableRow = {
  uuid: string;
  name: string;
  created_at: string;
};
