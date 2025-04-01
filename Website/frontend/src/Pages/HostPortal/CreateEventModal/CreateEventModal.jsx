import { createPortal } from "react-dom";
import { Button3 } from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
import styled from "styled-components";
import Input from "../../../components/Input/Input";
import useUserState from "../../../hooks/use-user-state";
import landing2 from '../../../assets/landing2.png';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'

const StepTracker = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;

  div {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ccc;
    color: white;
    font-weight: bold;
  }

  div.active {
    background: var(--host-bg-light);
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  color: var(--text-primary);
`;

const MapGrid = styled.div`
  display: grid;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 10px; 
  width: 100%; 
  max-height: 80vh; 
  overflow-y: auto;
`;


const MapCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  width: 190px;
  border: ${({ selected }) => (selected ? "2px solid var(--host-bg-light)" : "1px solid #ddd")};
  box-shadow: 0 0 5px ${({ selected }) => (selected ? 'rgba(58, 97, 209, 0.5)' : "rgba(255, 255, 255, 0.5)")};

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }

  .info {
    padding: 8px;
    text-align: left;
  }

  .category {
    font-size: 0.7rem;
    font-weight: bold;
    color: #555;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 3px 0;
  }

  .capacity {
    font-size: 0.75rem;
    color: #666;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export default function CreateEventModal() {
  const {user} = useUserState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventType: "private",
    hostId: user.id
  });
  const [selectedMap, setSelectedMap] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const maps = [
    { id: 1, name: "Main Hall", capacity: 500, preview: landing2 },
    { id: 2, name: "Conference Room", capacity: 200, preview: landing2 },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
  };
  const openModal = () => setIsModalOpen(true);

  const onNextClick = () => {
    if(step == 1 && (!eventData.eventName || !eventData.eventDate || !eventData.eventTime || !eventData.eventType || eventData.hostId)){
        setErrorMsg('Missing Required Fields');
        return;
    }else if(step == 1){
        const today = new Date();
        const selectedDateTime = new Date(`${eventData.eventDate}T${eventData.eventTime}`);

        if (selectedDateTime < today) {
            setErrorMsg('Event date and time cannot be in the past');
            return;
        }
    }else if(step === 2 && !selectedMap){
        setErrorMsg('Please select a template');
        return;
    }

    setErrorMsg('');
    setStep((prev) => prev + 1);
  }

  const onBackClick = () => {
    setStep((prev) => prev - 1);
  }

  const onSubmitClick = () => {
    closeModal();
  }

  return (
    <>
      {createPortal(
        <Modal isOpen={isModalOpen} closeModal={closeModal} title="Create New Event">
          <StepTracker>
            {[1, 2, 3].map((num) => (
              <div key={num} className={step >= num ? "active" : ""}>{num}</div>
            ))}
          </StepTracker>
          {step === 1 && (
            <FormSection>
              <Input label="Event Name" name="eventName" data={eventData} setData={setEventData} placeholder="Enter event name" required role="host"/>
              <Input label="Event Date" type="date" name="eventDate" data={eventData} setData={setEventData} required role="host"/>
              <Input label="Event Time" type="time" name="eventTime" data={eventData} setData={setEventData} required role="host"/>
              <Input label="Event Type" 
                    type="dropdown" 
                    name="eventType" 
                    data={eventData} 
                    setData={setEventData} 
                    placeholder="Enter event type" 
                    required 
                    role="host"
                    options={[{name: "Public", value: 'public'}, {name: "Private", value: 'private'}]}/>
            </FormSection>
          )}
          {step === 2 && (
            <>
            <SectionTitle>Select a template</SectionTitle>
            <MapGrid>
              {maps.map((map) => (
                <MapCard key={map.id} selected={selectedMap === map.id} onClick={() => setSelectedMap(map.id)}>
                  <img src={map.preview} alt={map.name} />
                  <div className="info">
                    <div className="category">Event</div>
                    <h4>{map.name}</h4>
                    <p className="capacity">Capacity: {map.capacity}</p>
                  </div>
                </MapCard>
              ))}
            </MapGrid>
          </>
          )}
          {step === 3 && (
            <div>
              <h3>Review Your Event</h3>
              <p>Name: {eventData.eventName}</p>
              <p>Date: {eventData.eventDate}</p>
              <p>Time: {eventData.eventTime}</p>
              <p>Type: {eventData.eventType}</p>
              <p>Map: {maps.find((m) => m.id === selectedMap)?.name || "None"}</p>
            </div>
          )}
          <ErrorMessage message={errorMsg} style={{marginTop: "10px"}}/>
          <Footer>
            {step > 1 && <Button3 onClick={onBackClick}>Back</Button3>}
            {step < 3 ?(<> <div></div><Button3 onClick={onNextClick}>Next</Button3></>) : <Button3 onClick={onSubmitClick}>Done</Button3>}
          </Footer>
        </Modal>,
        document.body
      )}
      <Button3 onClick={openModal}>Host Event</Button3>
    </>
  );
}