/**
 * API Client for CRM Backend
 * Base configuration for all API calls with error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Make a GET request to the API
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: "Unknown Error",
        message: response.statusText,
      }));

      throw new ApiClientError(
        errorData.message || "Request failed",
        response.status,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

/**
 * Make a POST request to the API
 */
export async function apiPost<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: "Unknown Error",
        message: response.statusText,
      }));

      throw new ApiClientError(
        errorData.message || "Request failed",
        response.status,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

/**
 * Make a PUT request to the API
 */
export async function apiPut<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: "Unknown Error",
        message: response.statusText,
      }));

      throw new ApiClientError(
        errorData.message || "Request failed",
        response.status,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

/**
 * Make a DELETE request to the API
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        success: false,
        error: "Unknown Error",
        message: response.statusText,
      }));

      throw new ApiClientError(
        errorData.message || "Request failed",
        response.status,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}
