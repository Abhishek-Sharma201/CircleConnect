import { apiURL } from "@/src/constants";

/**
 * Central API fetch utility.
 * Prepends apiURL, attaches Authorization header, parses JSON, and throws on error.
 *
 * @param {string} path - API path e.g. "/api/posts/getAll"
 * @param {RequestInit} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} parsed JSON response data
 */
export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${apiURL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.message || data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}
