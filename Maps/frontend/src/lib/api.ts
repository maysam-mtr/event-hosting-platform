import type { CustomResponse, Map } from "./types"

const API_BASE_URL = "https://mapsback.eventurelb.online/api"

// Helper function to handle API responses
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

// Include credentials with all requests
const defaultFetchOptions = {
  credentials: "include" as RequestCredentials,
}

// Get all maps
export async function getMaps(): Promise<CustomResponse<Map[]>> {
  const response = await fetch(`${API_BASE_URL}/maps/getMaps`, defaultFetchOptions)
  return handleResponse<Map[]>(response)
}

// Get map by ID
export async function getMapById(id: string): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/getMap/${id}`, defaultFetchOptions)
  return handleResponse<Map>(response)
}

// Create a new map
export async function createMap(formData: FormData): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/createMap`, {
    method: "POST",
    body: formData,
    ...defaultFetchOptions,
  })
  return handleResponse<Map>(response)
}

// Update an existing map
export async function updateMap(id: string, formData: FormData): Promise<CustomResponse<Map>> {
  const response = await fetch(`${API_BASE_URL}/maps/updateMap/${id}`, {
    method: "PUT",
    body: formData,
    ...defaultFetchOptions,
  })
  return handleResponse<Map>(response)
}

// Delete a map
export async function deleteMap(id: string): Promise<CustomResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/maps/deleteMap/${id}`, {
    method: "DELETE",
    ...defaultFetchOptions,
  })
  return handleResponse<null>(response)
}

// Get latest maps
export async function getLatestMaps(): Promise<CustomResponse<Map[]>> {
  const response = await fetch(`${API_BASE_URL}/latestMaps/getLatestMapsDisplay`, defaultFetchOptions)
  return handleResponse<Map[]>(response)
}

// Authentication functions
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

export async function logout(): Promise<CustomResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, defaultFetchOptions)
  return handleResponse<null>(response)
}

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
