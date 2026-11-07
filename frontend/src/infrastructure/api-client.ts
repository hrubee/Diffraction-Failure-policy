/**
 * Infrastructure Layer: Type-safe HTTP Client
 * Includes multi-tenant API key injection and typed error handling.
 */

export const DEFAULT_API_KEY = 'diff_live_demo_key_778899';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly detail?: string
  ) {
    super(`API Error ${status}: ${detail || statusText}`);
    this.name = 'ApiError';
  }
}

export async function requestJson<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('X-API-Key')) {
    headers.set('X-API-Key', DEFAULT_API_KEY);
  }

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const errData = await response.json();
      detail = errData.detail || JSON.stringify(errData);
    } catch {
      detail = await response.text().catch(() => undefined);
    }
    throw new ApiError(response.status, response.statusText, detail);
  }

  return response.json() as Promise<T>;
}
