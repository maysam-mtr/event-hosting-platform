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
  border: 5px solid #fff;
  border-top: 5px solid ${({$role}) => $role === 'host' ? 'var(--host-bg-light)' : 'var(--general-bg-light)'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  min-height: 100%;
`;

export default function LoadingSpinner({role = 'guest'}) {
  return (
    <SpinnerContainer>
      <Spinner $role={role}/>
    </SpinnerContainer>
  );
}