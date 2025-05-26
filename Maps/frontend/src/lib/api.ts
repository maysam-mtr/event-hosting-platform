/**
 * API Service Module
 * Handles all HTTP requests to the backend API with consistent error handling
 * Includes authentication, map operations, and latest map functionality
 */

import type { CustomResponse, Map } from "./types"

const API_BASE_URL = "http://localhost:3000/api"

/**
 * Helper function to handle API responses consistently
 */
async function handleResponse<T>(response: Response): Promise<CustomResponse<T>> {
  if (!response.ok) {
    const errorData: CustomResponse<T> = await response.json().catch(() => ({
      statusCode: response.status,
      messages: "An error occurred",
      data: null,
      errors: null,
    }))
    throw new Error(errorData.messages.toString())
  }
  return response.json()
}

// Default fetch options for all requests (includes credentials for cookies)
const defaultFetchOptions = {
  credentials: "include" as RequestCredentials,
}

/**
 * Get all maps from the server
 */
export async function getMaps(): Promise<CustomResponse<Map[]>> {
  const response = await fetch(`${API_BASE_URL}/maps/getMaps`, defaultFetchOptions)
  return handleResponse<Map[]>(response)
}

/**
 * Get specific map by ID
 */
export async function getMapById(id: string): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/getMap/${id}`, defaultFetchOptions)
  return handleResponse<Map>(response)
}

/**
 * Create a new map with file uploads
 */
export async function createMap(formData: FormData): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/createMap`, {
    method: "POST",
    body: formData,
    ...defaultFetchOptions,
  })
  return handleResponse<Map>(response)
}

/**
 * Update an existing map with new files
 */
export async function updateMap(id: string, formData: FormData): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/updateMap/${id}`, {
    method: "PUT",
    body: formData,
    ...defaultFetchOptions,
  })
  return handleResponse<Map>(response)
}

/**
 * Delete a map and all associated files
 */
export async function deleteMap(id: string): Promise<CustomResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/maps/deleteMap/${id}`, {
    method: "DELETE",
    ...defaultFetchOptions,
  })
  return handleResponse<null>(response)
}

/**
 * Get latest maps for display purposes
 */
export async function getLatestMaps(): Promise<CustomResponse<Map[]>> {
  const response = await fetch(`${API_BASE_URL}/latestMaps/getLatestMapsDisplay`, defaultFetchOptions)
  return handleResponse<Map[]>(response)
}

/**
 * Admin login with username and password
 */
export async function login(username: string, password: string): Promise<CustomResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    ...defaultFetchOptions,
  })
  return handleResponse<null>(response)
}

/**
 * Admin logout - clears authentication cookies
 */
export async function logout(): Promise<CustomResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, defaultFetchOptions)
  return handleResponse<null>(response)
}

/**
 * Check current authentication status
 */
export async function checkAuth(): Promise<CustomResponse<{ authenticated: boolean }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check`, defaultFetchOptions)
    return handleResponse<{ authenticated: boolean }>(response)
  } catch (error) {
    return {
      statusCode: 500,
      messages: "Failed to check authentication",
      data: { authenticated: false },
      errors: null,
    }
  }
}
