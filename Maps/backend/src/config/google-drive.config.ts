/**
 * Google Drive API Configuration
 * Sets up OAuth2 client and Google Drive API instance for file operations
 */

import { google } from "googleapis"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } from "./index"

// Configure OAuth2 client with Google credentials
const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)

// Set refresh token for automatic token renewal
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

// Initialize Google Drive API with authentication
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
})

export default drive
