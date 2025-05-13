import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 70%;
  height: 70%;
  max-width: 100px;
  max-height: 100px;
  min-width: 20px;
  min-height: 20px;
  border: 5px solid #fff;
  border-top: 5px solid ${({$role}) => $role === 'host' ? 'var(--host-bg-light)' : 'var(--general-bg-light)'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  padding: ${({$padding}) => $padding === true ? '50px' : '0px'};
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  min-height: 100%;
`;

export default function LoadingSpinner({role = 'guest', padding = false}) {
  return (
    <SpinnerContainer>
      <Spinner $role={role} $padding={padding}/>
    </SpinnerContainer>
  );
}