/**
 * LoadingSpinner Component
 *
 * A reusable loading spinner component that displays a rotating animation
 * to indicate that content is being loaded or an operation is in progress.
 *
 * Key Features:
 * - Customizable role-based styling (host vs guest themes)
 * - Configurable padding and sizing
 * - Smooth CSS keyframe animations
 * - Responsive design with min/max constraints
 * - Accessible loading indicator
 *
 * Props:
 * - role: 'host' or 'guest' for theme-appropriate colors
 * - padding: boolean to add extra padding around spinner
 *
 * Usage: Used throughout the application for API request loading states,
 * form submissions, page transitions, and data fetching operations
 */
import styled, { keyframes } from "styled-components"

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  width: 70%;
  height: 70%;
  max-width: 100px;
  max-height: 100px;
  min-width: 20px;
  min-height: 20px;
  border: 5px solid #fff;
  border-top: 5px solid ${({ $role }) => ($role === "host" ? "var(--host-bg-light)" : "var(--general-bg-light)")};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  padding: ${({ $padding }) => ($padding === true ? "50px" : "0px")};
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  min-height: 100%;
`

export default function LoadingSpinner({ role = "guest", padding = false }) {
  return (
    <SpinnerContainer>
      <Spinner $role={role} $padding={padding} />
    </SpinnerContainer>
  )
}
