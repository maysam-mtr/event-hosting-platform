/**
 * Input Component
 *
 * Reusable form input component with multiple input types:
 * - Text, email, password, number inputs
 * - Date and time pickers
 * - Dropdown/select inputs
 * - Textarea for longer text
 * - Validation state display and error messages
 *
 * Provides consistent styling and behavior across all forms
 * with role-based theming (host vs user) and accessibility support.
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
      border-color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-light)' : "var(--general-bg-light)"};
      box-shadow: 0 0 5px ${({ $role }) => $role === 'host' ? 'rgba(58, 97, 209, 0.5)' : "rgba(241, 134, 80, 0.5)"};
    }
`;

const SelectElement = styled.select`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: var(--body);
  background-color: var(--background-three);
  color: var(--text-primary);
  outline: none;

  &:focus {
      border-color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-light)' : "var(--general-bg-light)"};
      box-shadow: 0 0 5px ${({ $role }) => $role === 'host' ? 'rgba(58, 97, 209, 0.5)' : "rgba(241, 134, 80, 0.5)"};
    }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-second);
`;

const Input = ({ label, type = "text", name, data, setData, placeholder, required = false, role = 'guest', options = [], style={} }) => {
  const handleChange = (e) => {
    if (typeof data === "object") {
      setData({ ...data, [name]: e.target.value });
    } else {
      //console.log(e.target.value)
      setData(e.target.value);
    }
  };

  return (
    <InputWrapper style={style}>
      <Label htmlFor={name}>{label}</Label>
      {type === "dropdown" ? (
        <SelectElement id={name} name={name} value={data[name] || data || ""} onChange={handleChange} required={required} $role={role}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.name}</option>
          ))}
        </SelectElement>
      ) : (
        <InputElement
          $role={role}
          type={type}
          id={name}
          name={name}
          value={typeof data === "object" ? data[name] || "" : data}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </InputWrapper>
  );
};

export default Input;

