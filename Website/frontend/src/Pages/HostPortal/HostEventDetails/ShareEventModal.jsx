import { createPortal } from "react-dom";
import Modal from "../../../components/Modal/Modal";
import { EnterButton } from "./EditEventModal";
import { useState } from "react";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";
import styled from "styled-components";

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  color: #333;
  background-color: #f9f9f9;
`;

const StyledInput2 = styled.textarea`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  color: #333;
  height: 90px;
  background-color: #f9f9f9;
`;


const CopyIcon = styled(FiCopy)`
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const CheckIcon = styled(FiCheck)`
  color: green;
`;

const ShareIcon = styled(FiShare2)`
color: #fff;
height: 10px;
`

export default function ShareEventModal({ eventDetails }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedField, setCopiedField] = useState("");

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => {
            setCopiedField("");
        }, 2000);
    };

    const renderField = (label, value, fieldName, inputType) => (
        <FieldWrapper>
            <FieldLabel>{label}</FieldLabel>
            <FieldContainer>
                {inputType === 'textarea' ? <StyledInput2
                    type='textarea'
                    readOnly
                    value={value || ""}
                />: <StyledInput
                type='text'
                readOnly
                value={value || ""}
            />}
                {copiedField === fieldName ? (
                    <CheckIcon size={20} />
                ) : (
                    <CopyIcon
                        size={20}
                        onClick={() => copyToClipboard(value || "", fieldName)}
                    />
                )}
            </FieldContainer>
        </FieldWrapper>
    );

    return (
        <>
            {createPortal(
                <Modal isOpen={isModalOpen} closeModal={closeModal} title="Share Event">
                    <FieldsWrapper>
                        {renderField("Event Code", eventDetails?.eventCode, "eventCode", "text")}
                        {eventDetails?.eventType === 'private' && renderField("Event Passcode", eventDetails?.eventPasscode, "eventPasscode", "text")}
                        {renderField("Event Link", `${import.meta.env.VITE_FRONTEND_URL}/event/details/${eventDetails?.eventCode}`, "eventLink", "text")}
                        {renderField("All", 
                            `Event code: ${eventDetails?.eventCode}\nPasscode: ${eventDetails?.eventPasscode}\nLink: ${import.meta.env.VITE_FRONTEND_URL}/event/details/${eventDetails?.eventCode}`,
                            "all", "textarea")}
                    </FieldsWrapper>
                </Modal>,
                document.body
            )}
            <EnterButton onClick={openModal}> <ShareIcon/> Share</EnterButton>
        </>
    );
}
