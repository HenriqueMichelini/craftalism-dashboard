// src/config/runtime.ts
// Helper to access runtime configuration injected by Docker

interface RuntimeConfig {
  VITE_API_URL?: string;
  VITE_API_TIMEOUT?: string;
}

// Extend Window interface to include runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/**
 * Get configuration value with fallback to build-time env var
 * This allows the same code to work in both development and production
 */
export function getRuntimeConfig<K extends keyof RuntimeConfig>(
  key: K
): string {
  // First, try runtime config (injected by Docker)
  const runtimeValue = window.__RUNTIME_CONFIG__?.[key];
  if (runtimeValue) {
    return runtimeValue;
  }

  // Fallback to build-time environment variable (for local dev)
  const buildTimeValue = import.meta.env[key];
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
  return getRuntimeConfig('VITE_API_URL') || 'http://localhost:3000';
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
