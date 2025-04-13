import styled from "styled-components";
import { MdErrorOutline, MdCheckCircleOutline, MdInfoOutline } from "react-icons/md";

const getColors = (type) => {
  switch (type) {
    case "success":
      return {
        bg: "#e8fff0",
        border: "#c6f0d7",
        color: "#007a3d",
      };
    case "error":
      return {
        bg: "#fff0f0",
        border: "#ffcccc",
        color: "#a30000",
      };
    case "neutral":
    default:
      return {
        bg: "#f0f4ff",
        border: "#d6e1ff",
        color: "#3a61d1",
      };
  }
};

const Card = styled.div`
  background-color: ${({ $type }) => getColors($type).bg};
  color: ${({ $type }) => getColors($type).color};
  padding: 2rem 2.5rem;
  border: 1px solid ${({ $type }) => getColors($type).border};
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
    color: ${({ $type }) => getColors($type).color};
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

export default function StatusPopup({message = "Hmm, here's something to note.", type = "neutral", // "success", "error", or "neutral"
}) {
  const renderIcon = () => {
    if (type === "success") return <MdCheckCircleOutline />;
    if (type === "error") return <MdErrorOutline />;
    return <MdInfoOutline />;
  };

  return (
    <CenterContainer>
      <Card $type={type}>
        <IconWrapper $type={type}>{renderIcon()}</IconWrapper>
        {message}
      </Card>
    </CenterContainer>
  );
}
