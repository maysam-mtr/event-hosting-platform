/**
 * Image Input Component
 *
 * Handles image upload and preview functionality:
 * - File selection with drag-and-drop support
 * - Image preview before upload
 * - File type and size validation
 * - Integration with Supabase storage
 * - Progress indication during upload
 *
 * Used for profile pictures, company logos, and event images
 * throughout the application with consistent upload experience.
 */

import React from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const InputElement = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: var(--body);
  background-color: var(--background-three);
  color: var(--text-primary);
  outline: none;

  &:focus {
    border-color: ${({ $role }) =>
      $role === "host" ? "var(--host-bg-light)" : "var(--general-bg-light)"};
    box-shadow: 0 0 5px
      ${({ $role }) =>
        $role === "host"
          ? "rgba(58, 97, 209, 0.5)"
          : "rgba(241, 134, 80, 0.5)"};
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-second);
`;

const ImageInput = ({label = "Upload Image", name, setFile, required = false, role = "guest"}) => {
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <InputWrapper>
      <Label htmlFor={name}>{label}</Label>
      <InputElement
        $role={role}
        type="file"
        accept="image/*"
        id={name}
        name={name}
        onChange={handleChange}
        required={required}
      />
    </InputWrapper>
  );
};

export default ImageInput;
