// src/config/runtime.ts
// Helper to access runtime configuration injected by Docker

interface RuntimeConfig {
  VITE_API_URL?: string;
  VITE_API_BASE_URL?: string;
  VITE_API_TIMEOUT?: string;
}

type ImportMetaWithOptionalEnv = ImportMeta & {
  env?: RuntimeConfig;
};

// Extend Window interface to include runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

function normalizeApiUrl(rawUrl: string): string {
  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    return "/api";
  }

  if (typeof window === "undefined") {
    return trimmedUrl;
  }

  try {
    const parsedUrl = new URL(trimmedUrl, window.location.origin);
    const isLocalHost =
      parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";

    if (
      isLocalHost &&
      parsedUrl.origin !== window.location.origin
    ) {
      return "/api";
    }

    return trimmedUrl;
  } catch {
    return trimmedUrl;
  }
}

/**
 * Get configuration value with fallback to build-time env var
 * This allows the same code to work in both development and production
 */
export function getRuntimeConfig<K extends keyof RuntimeConfig>(
  key: K
): string {
  const runtimeConfig =
    typeof window === "undefined" ? undefined : window.__RUNTIME_CONFIG__;
  const buildTimeEnv = (import.meta as ImportMetaWithOptionalEnv).env;

  // First, try runtime config (injected by Docker)
  const runtimeValue = runtimeConfig?.[key];
  if (runtimeValue) {
    return runtimeValue;
  }

  // Fallback to build-time environment variable (for local dev)
  const buildTimeValue = buildTimeEnv?.[key];
  if (buildTimeValue) {
    return buildTimeValue;
  }

  // Return empty string if not found
  console.warn(`Config key "${key}" not found in runtime or build-time config`);
  return '';
}

/**
 * Convenience function to get API URL
 */
export function getApiUrl(): string {
  const runtimeConfig =
    typeof window === "undefined" ? undefined : window.__RUNTIME_CONFIG__;
  const buildTimeEnv = (import.meta as ImportMetaWithOptionalEnv).env;

  const configuredApiUrl =
    runtimeConfig?.VITE_API_URL ||
    runtimeConfig?.VITE_API_BASE_URL ||
    buildTimeEnv?.VITE_API_URL ||
    buildTimeEnv?.VITE_API_BASE_URL;

  return normalizeApiUrl(configuredApiUrl || "/api");
}

/**
 * Convenience function to get API timeout
 */
export function getApiTimeout(): number {
  const timeout = getRuntimeConfig('VITE_API_TIMEOUT');
  return timeout ? parseInt(timeout, 10) : 10000;
}

// Export the config object for easy access
export const config = {
  apiUrl: getApiUrl(),
  apiTimeout: getApiTimeout(),
};
