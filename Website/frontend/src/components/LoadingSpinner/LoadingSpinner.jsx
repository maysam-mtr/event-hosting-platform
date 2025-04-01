import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 50%;
  height: 50%;
  max-width: 100px;
  max-height: 100px;
  border: 5px solid rgba(255, 140, 0, 0.3);
  border-top: 5px solid #ff8c00;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
}