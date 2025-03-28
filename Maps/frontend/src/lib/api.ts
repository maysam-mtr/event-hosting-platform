import type { Map } from "./types"

const API_BASE_URL = "/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "An error occurred")
  }
  return response.json()
}

// Get all maps
export async function getMaps(): Promise<{ message: string; data: Map[] }> {
  const response = await fetch(`${API_BASE_URL}/maps/getMaps`)
  return handleResponse<{ message: string; data: Map[] }>(response)
}

// Get map by ID
export async function getMapById(id: string): Promise<{ message: string; data: Map }> {
  const response = await fetch(`${API_BASE_URL}/maps/getMap/${id}`)
  return handleResponse<{ message: string; data: Map }>(response)
}

// Create a new map
export async function createMap(formData: FormData): Promise<{ message: string; data: Map }> {
  const response = await fetch(`${API_BASE_URL}/maps/createMap`, {
    method: "POST",
    body: formData,
  })
  return handleResponse<{ message: string; data: Map }>(response)
}

// Update an existing map
export async function updateMap(id: string, formData: FormData): Promise<{ message: string; data: Map }> {
  const response = await fetch(`${API_BASE_URL}/maps/updateMap/${id}`, {
    method: "PUT",
    body: formData,
  })
  return handleResponse<{ message: string; data: Map }>(response)
}

// Delete a map
export async function deleteMap(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/maps/deleteMap/${id}`, {
    method: "DELETE",
  })
  return handleResponse<{ message: string }>(response)
}

// Add the getLatestMaps function
// Get latest maps
export async function getLatestMaps(): Promise<{ message: string; data: Map[] }> {
  const response = await fetch(`${API_BASE_URL}/latestMaps/getLatestMapsWithDetails`)
  return handleResponse<{ message: string; data: Map[] }>(response)
}

