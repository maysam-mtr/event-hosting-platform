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
  color:var(--text-primary);
  outline: none;

  &:focus {
      border-color: var(--general-bg-light);
      box-shadow: 0 0 5px rgba(241, 134, 80, 0.5);
    }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-second);
`;

const Input = ({ label, type = "text", name, data, setData, placeholder, required = false }) => {
  const handleChange = (e) => {
    if (typeof data === "object") {
      setData({ ...data, [name]: e.target.value });
    } else {
      setData(e.target.value);
    }
  };

  return (
    <InputWrapper>
      <Label htmlFor={name}>{label}</Label>
      <InputElement
        type={type}
        id={name}
        name={name}
        value={typeof data === "object" ? data[name] || "" : data}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </InputWrapper>
  );
};

export default Input;
