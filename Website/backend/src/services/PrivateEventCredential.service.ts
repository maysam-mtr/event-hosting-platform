/**
 * Private Event Credential Service
 *
 * This service handles the management of private event credentials (passcodes)
 * for secure access to private events. It provides functionality to create,
 * retrieve, and delete event passcodes with automatic generation capabilities.
 */

import PrivateEventCredential from "../models/PrivateEventCredential"
import crypto from "crypto"

/**
 * Generates a random 6-character alphanumeric passcode
 * Uses crypto module for secure random generation
 * @returns {string} A random passcode in uppercase format
 */
const generateRandomPasscode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase()
}

/**
 * Creates a new private event credential with either a provided or generated passcode
 * @param {string} eventId - The unique identifier of the event
 * @param {string} [passcode] - Optional custom passcode, if not provided one will be generated
 * @returns {Promise<PrivateEventCredential>} The created credential object
 * @throws {Error} If credential creation fails
 */
const createPrivateEventCredential = async (eventId: string, passcode?: string): Promise<PrivateEventCredential> => {
  try {
    const finalPasscode = passcode || generateRandomPasscode()

    const credential = await PrivateEventCredential.create({
      eventId,
      passcode: finalPasscode,
    })

    return credential
  } catch (error) {
    throw new Error((error as Error).message || "Failed to create private event credential.")
  }
}

/**
 * Retrieves the passcode for a specific event
 * @param {string} eventId - The unique identifier of the event
 * @returns {Promise<string|null>} The passcode if found, null otherwise
 * @throws {Error} If credential is not found or retrieval fails
 */
const getPrivateEventCredential = async (eventId: string): Promise<string | null> => {
  try {
    const credential = await PrivateEventCredential.findOne({
      where: { eventId },
    })

    if (!credential) {
      throw new Error("Private event credentials not found")
    }

    return credential.passcode
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch private event credentials.")
  }
}

/**
 * Deletes the private event credential for a specific event
 * @param {string} eventId - The unique identifier of the event
 * @returns {Promise<void>}
 * @throws {Error} If credential is not found or deletion fails
 */
const deletePrivateEventCredential = async (eventId: string): Promise<void> => {
  try {
    const credential = await PrivateEventCredential.findOne({
      where: { eventId },
    })

    if (!credential) {
      throw new Error("Private event credentials not found")
    }

    await credential.destroy()

    console.log(`Private event credentials deleted for event ID: ${eventId}`)
  } catch (error) {
    throw new Error((error as Error).message || "Failed to delete private event credentials.")
  }
}

export { createPrivateEventCredential, getPrivateEventCredential, deletePrivateEventCredential }
