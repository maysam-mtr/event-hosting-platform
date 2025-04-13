import styled from "styled-components";
import { MdErrorOutline } from "react-icons/md";

const ErrorCard = styled.div`
  background-color: #fff0f0;
  color: #a30000;
  padding: 2rem 2.5rem;
  border: 1px solid #ffcccc;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  animation: popIn 0.3s ease;

  @keyframes popIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    color: #a30000;
    flex-shrink: 0;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  padding: 1rem;
`;

export default function ErrorPopup({ message = "Oops... something went wrong." }) {
  return (
    <CenterContainer>
      <ErrorCard>
        <IconWrapper>
          <MdErrorOutline />
        </IconWrapper>
        {message}
      </ErrorCard>
    </CenterContainer>
  );
}
