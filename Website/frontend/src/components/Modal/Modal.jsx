import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  max-width: 600px;
  max-height: 80vh;
  width: 100%;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  background-color: #f4f4f4;
  border-bottom: 2px solid #ccc;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ModalTitle = styled.p`
  margin: 0;
  font-size: var(--heading-4);
  font-weight: 700;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
`;

const ModalContent = styled.div`
  padding: 20px;
  background-color: white;
  display: flex;
flex-direction: column;
gap: 1rem;
`;

export default function Modal({ isOpen, closeModal, title, children }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={closeModal}>×</CloseButton>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

