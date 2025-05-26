/**
 * Popup Component
 *
 * A lightweight notification popup component for displaying temporary
 * success and error messages to users with animated visual feedback.
 *
 * Key Features:
 * - Auto-dismiss with 2-second timeout
 * - Animated border color transitions
 * - Success and error message types
 * - Icon-based visual indicators
 * - Fixed positioning for consistent placement
 * - Smooth opacity transitions
 *
 * Props:
 * - popUpSettings: object containing message, type, and visibility state
 *   - message: string text to display
 *   - type: 'success' or 'fail' for styling
 *   - isVisible: boolean to trigger popup display
 *
 * Usage: Used throughout the application for user feedback on:
 * - Form submissions (success/error)
 * - API operation results
 * - Authentication status changes
 * - Data save confirmations
 */

import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

// Success border color animation
const successColorShiftAnimation = keyframes`
  0% {
    border-color: #d3d3d3;
  }
  25% {
    border-color: #d3d3d3;
  }
  50% {
    border-color: rgb(34, 181, 96);
  }
  75% {
    border-color: #2ecc71;
  }
  100% {
    border-color: #d3d3d3;
  }
`

// Fail border color animation
const failColorShiftAnimation = keyframes`
  0% {
    border-color: #d3d3d3;
  }
  25% {
    border-color: #d3d3d3;
  }
  50% {
    border-color: #e74c3c;
  }
  75% {
    border-color: #c0392b;
  }
  100% {
    border-color: #d3d3d3;
  }
`

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  color: ${({ $type }) => ($type === "success" ? "#2ecc71" : "#e74c3c")};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  z-index: 9999;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid transparent;
  animation: ${({ $type }) => ($type === "success" ? successColorShiftAnimation : failColorShiftAnimation)} 1s infinite ease-in-out;
`

const Popup = ({ popUpSettings }) => {
  const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    if (popUpSettings.isVisible) {
      setVisibility(true)
      const timer = setTimeout(() => {
        setVisibility(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [popUpSettings])

  return (
    <NotificationContainer $type={popUpSettings.type} $isVisible={visibility}>
      {popUpSettings.type === "success" ? (
        <FaCheckCircle size={20} color="#2ecc71" />
      ) : (
        <FaExclamationCircle size={20} color="#e74c3c" />
      )}
      {popUpSettings.message}
    </NotificationContainer>
  )
}

export default Popup
