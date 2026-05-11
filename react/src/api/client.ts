import { config } from "../config/runtime.js";

const DEFAULT_BASE_URL = "/api";

function getBaseUrl(): string {
  const configuredBaseUrl = config.apiUrl || DEFAULT_BASE_URL;

  if (typeof window === "undefined") {
    return configuredBaseUrl;
  }

  try {
    const parsedUrl = new URL(configuredBaseUrl, window.location.origin);
    const isLocalHost =
      parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";

    if (isLocalHost && parsedUrl.origin !== window.location.origin) {
      return "/api";
    }
  } catch {
    // Keep configured base URL when it cannot be parsed.
  }

  return configuredBaseUrl;
}

function buildUrl(baseUrl: string, endpoint: string): string {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (
    normalizedBase.endsWith("/api") &&
    normalizedEndpoint.startsWith("/api/")
  ) {
    return `${normalizedBase}${normalizedEndpoint.replace(/^\/api/, "")}`;
  }

  return `${normalizedBase}${normalizedEndpoint}`;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return null as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    const contentType = response.headers.get("content-type") || "unknown";

    throw new Error(
      `Failed to parse API response as JSON (status ${response.status}, content-type: ${contentType}).`,
    );
  }
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = buildUrl(getBaseUrl(), endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        response.statusText,
      );
    }

    return await parseJsonResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch data",
    );
  }
}
