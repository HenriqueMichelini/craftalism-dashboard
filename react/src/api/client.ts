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

function getProblemDetailMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const detail = typeof record.detail === "string" ? record.detail : null;
  const title = typeof record.title === "string" ? record.title : null;

  return detail || title;
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `HTTP error! status: ${response.status}`;
  const responseText = await response.text();

  if (!responseText.trim()) {
    return fallback;
  }

  try {
    const body = JSON.parse(responseText) as unknown;
    return getProblemDetailMessage(body) || fallback;
  } catch {
    return responseText.trim() || fallback;
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
      const message = await readErrorMessage(response);

      throw new ApiError(
        message,
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

type QueryValue = string | number | null | undefined;

export function buildEndpointWithQuery(
  endpoint: string,
  query: Record<string, QueryValue>,
): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const normalizedValue =
      typeof value === "string" ? value.trim() : String(value);

    if (!normalizedValue) {
      return;
    }

    params.set(key, normalizedValue);
  });

  const queryString = params.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
