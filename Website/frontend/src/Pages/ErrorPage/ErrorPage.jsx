import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ErrorContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  position: relative;
  padding: 0 2rem;
`;

const BackgroundShape = styled.div`
  position: absolute;
  width: 450px;
  height: 450px;
  background: var(--general-bg-light);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  z-index: 0;
  opacity: 0.2;

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
    transform: translate(-50%, -50%) scale(1.2);
  }

  @media (max-width: 480px) {
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  color: var(--general-bg-base);
  margin: 0;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 5rem;
  }

  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: var(--heading-6);
  color: var(--text-primary);
  max-width: 500px;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 70%;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    max-width: 80%;
  }
`;

const BackButton = styled.button`
  background: var(--general-bg-base);
  color: white;
  padding: 12px 24px;
  font-size: 1.2rem;
  text-decoration: none;
  border-radius: 10px;
  margin-top: 20px;
  z-index: 1;
  transition: 0.3s ease-in-out;
  border: 1px solid var(--general-bg-dark);
  border-bottom: 3px solid var(--general-bg-dark);

  &:hover {
    background: #d93b00;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const ErrorPage = (/*{ errorCode = "404", errorMessage = "Page Not Found" }*/) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { errorCode = "404", 
          errorMessage = "The page you're looking for does not exit. Try something else?", 
          errorTitle = "Page Not Found" } = location.state || {};

  const onBackButtonClick = () => {
    navigate('/', {replace: true});
  }
  return (
    <ErrorContainer>
      <BackgroundShape />
      <ErrorCode>{errorCode}</ErrorCode>
      <ErrorMessage>{errorTitle}: {errorMessage}</ErrorMessage>
      <BackButton onClick={onBackButtonClick}>Go Back Home</BackButton>
    </ErrorContainer>
  );
};

export default ErrorPage;
