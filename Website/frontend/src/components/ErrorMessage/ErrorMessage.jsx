/**
 * Error Message Component
 *
 * Displays error messages in a consistent format across the application:
 * - Shows validation errors from forms
 * - Displays API error responses
 * - Provides user-friendly error formatting
 * - Supports conditional rendering based on error state
 * - Maintains consistent styling for error display
 *
 * Used throughout forms and pages to show error feedback to users.
 */

import React from "react";
import styled from "styled-components";
import { FiAlertCircle } from "react-icons/fi";

const ErrorMessageContainer = styled.div`
  color: #d32f2f;
  border-radius: 5px;
  font-size: var(--small-1);
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = ({ message, style }) => {
  if (!message) return null;
  return (
    <ErrorMessageContainer style={style}>
      <FiAlertCircle size={18} />
      {message}
    </ErrorMessageContainer>
  );
};

export default ErrorMessage;
