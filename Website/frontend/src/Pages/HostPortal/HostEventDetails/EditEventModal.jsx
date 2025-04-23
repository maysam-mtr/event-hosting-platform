import { createPortal } from "react-dom";
import { Button3 } from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../../../components/Input/Input";
import useUserState from "../../../hooks/use-user-state";
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import useSendRequest from "../../../hooks/use-send-request";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 20px;
`;

const InputWrapper = styled.div`
display: flex;
flex-direction: row;
gap: 1rem;
width: 100%;
justify-content: space-between;
  > * {
    flex: 1;
  }
`;

const EnterButton = styled.button`
  padding: 12px 16px;
  background-color: var(--host-bg-base);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
  margin-top: 12px;

  &:hover {
    background-color: var(--host-bg-dark);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default function EditEventModal({setPopup, event, updatEventDetails}) {
  const {user} = useUserState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: event.eventName,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    eventType: event.eventType,
  });
  console.log(eventData)
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
 
  const [sendRequest] = useSendRequest();

  const closeModal = () => {
    setErrorMsg("");
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);

  const onSubmitClick = () => {
    editEvent();
  }

  async function editEvent(){
    const URL = `/api/events/update/${event.code}`;
    const INIT = {method: 'PUT', body: JSON.stringify({
      eventName: eventData.eventName,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime.slice(0, 5),
      endTime: eventData.endTime.slice(0, 5),
      eventType: eventData.eventType,
    })}
    console.log(INIT)

    const {response} = await sendRequest(URL, INIT);
    console.log(response)

    if(response?.success === true){
      setPopup({message: 'Event Created Successfuly', type: 'success', isVisible: true});
      updatEventDetails();
      closeModal();
    }else{
      setErrorMsg(response?.error[0]?.message || "Something went wrong. Try Again!");
    }
  }

  return (
    <>
    
      {createPortal(
        <Modal isOpen={isModalOpen} closeModal={closeModal} title="Edit Event">
            <FormSection>
              <Input label="Event Name" name="eventName" data={eventData} setData={setEventData} placeholder="Enter event name" required role="host"/>
              <Input label="Event Type" 
                    type="dropdown" 
                    name="eventType" 
                    data={eventData} 
                    setData={setEventData} 
                    placeholder="Enter event type" 
                    required 
                    role="host"
                    options={[{name: "Public", value: 'public'}, {name: "Private", value: 'private'}]}/>
              <InputWrapper>
                <Input label="Start Date" type="date" name="startDate" data={eventData} setData={setEventData} required role="host"/>
                <Input label="End Date" type="date" name="endDate" data={eventData} setData={setEventData} required role="host"/>
              </InputWrapper>

              <InputWrapper>
                <Input label="Start Time" type="time" name="startTime" data={eventData} setData={setEventData} required role="host"/>
                <Input label="End Time" type="time" name="endTime" data={eventData} setData={setEventData} required role="host"/>
              </InputWrapper>
            </FormSection>

          
          <ErrorMessage message={errorMsg} style={{marginTop: "10px"}}/>
          <Footer>
                <Button3 onClick={onSubmitClick}>{loading ? <LoadingSpinner/> : 'Update'}</Button3>
          </Footer>
        </Modal>,
        document.body
      )}
      <EnterButton onClick={openModal}>Edit Event</EnterButton> 
    </>
  );
}