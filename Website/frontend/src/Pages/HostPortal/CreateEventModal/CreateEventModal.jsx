import { createPortal } from "react-dom";
import { Button3 } from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../../../components/Input/Input";
import useUserState from "../../../hooks/use-user-state";
import landing2 from '../../../assets/landing2.png';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import useSendRequest from "../../../hooks/use-send-request";
import { FiCheck } from 'react-icons/fi'
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import Popup from "../../../components/Popup/Popup";
import formatDateTime from "../../../utils/formatDateTime";

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

const SubscriptionCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 20px 24px;
  background: var(--background-three);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SubscriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.2rem;
  }

  span {
    background: var(--host-bg-base);
    color: white;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const SubscriptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 24px;
  font-size: 0.9rem;
  color: #444;

  div {
    display: flex;
    flex-direction: column;

    label {
      font-weight: bold;
      color: #333;
    }

    span {
      margin-top: 4px;
    }
  }
`;

const PurchaseButton = styled.button`
  width: fit-content;
  min-width: 70px;
  padding: 8px;
  background: var(--host-bg-base);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
 

  &:hover {
    background: var(--host-bg-base-hover);
  }
`;

const SuccessMessage = styled.div`
font-size: 0.85rem;
color: var(--green-color);
`;

const CheckIcon = styled(FiCheck)`
  color: var(--green-color);
  font-size: 16px;
  margin-right: 8px;
`;

export default function CreateEventModal({setPopup}) {
  const {user} = useUserState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: "",
    startDate: "",
    endDate: "",
    startTime: '',
    endTime: '',
    eventType: "public",
    //hostId: user.id,
    subscriptionId: '',
    mapTemplateId: ''
  });
  const [selectedMap, setSelectedMap] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [maps, setMaps] = useState([]);
 
  const [sendRequest] = useSendRequest();

  const closeModal = () => {
    setEventData({
      eventName: "",
      startDate: "",
      endDate: "",
      startTime: '',
      endTime: '',
      eventType: "public",
      //hostId: user.id,
      subscriptionId: '',
      mapTemplateId: ''
    })
    setIsModalOpen(false);
    setStep(1);
  };
  const openModal = () => setIsModalOpen(true);

  const onNextClick = () => {
    if(step == 1 && (!eventData.eventName || !eventData.startDate || !eventData.endDate || !eventData.startTime ||
      !eventData.endTime || !eventData.eventType)){
        setErrorMsg('Missing Required Fields');
        return;
    }else if(step == 1){
      const now = new Date();

      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);
  
      if (startDateTime < now) {
        setErrorMsg("Start date/time can't be in the past");
        return;
      }
  
      if (endDateTime <= startDateTime) {
        setErrorMsg("End date/time must be after start date/time");
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
    createEvent();
    closeModal();
  }

  async function createEvent(){
    const URL = '/api/events/create';
    const INIT = {method: 'POST', body: JSON.stringify({
      eventName: eventData.eventName,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      eventType: eventData.eventType,
      subscriptionId: eventData.subscriptionId,
      mapTemplateId: selectedMap
    })}
    console.log(INIT)

    const {response} = await sendRequest(URL, INIT);
    console.log(response)

    if(response?.success === true){
      setPopup({message: 'Event Created Successfuly', type: 'success', isVisible: true});
    }else{
      setErrorMsg(response?.error[0]?.message || "Something went wrong. Try Again!");
    }
  }

  async function getSubscriptionPlan(){
    const URL = '/api/subscriptionplan/get';

    const {response} = await sendRequest(URL);
    //console.log(response)

    if(response?.success === true){
      const plan = response.data[0];
      setSubscriptionPlan(plan);
    }else{
      setErrorMsg("Something went wrong. Please Try again!");
    }
  }

  async function createSubscriptionPlan(){
    setLoading(true);
    const URL = '/api/subscriptions/new';
    const INIT = {method: 'POST', body: JSON.stringify({planId: subscriptionPlan?.id})}

    const {response} = await sendRequest(URL, INIT);
    //console.log(response)

    if(response?.success === true){
      const subscription = response.data[0];
      setEventData((prev) => ({...prev, subscriptionId: subscription?.id}))
    }else{
      setErrorMsg("Something went wrong. Please Try again!");
    }

    setLoading(false);
  }

  async function getMaps(){
    const URL = '/api/latestMaps/getLatestMapsDisplay';

    const {response} = await sendRequest(URL, {}, 'maps');
    console.log(response)

    if(response?.statusCode === 200){
      setMaps(response.data)
    }else{
      setMaps([])
      setErrorMsg("Something went wrong. Please Try again!");
    }
  }

  const getMapPreviewImg = (mapId) => {
    if(!mapId){
      return landing2;
    }
      
   return import.meta.env.VITE_SUPABASE_IMG_URL +  mapId;
                
  }

  useEffect(() => {
    getSubscriptionPlan();
    getMaps();
  },[])

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
          )}
          {step === 2 && (
            <>
            <SectionTitle>Select a Map Template</SectionTitle>
            <MapGrid>
              {maps.map((map) => (
                <MapCard key={map.id} selected={selectedMap === map.id} onClick={() => setSelectedMap(map.id)}>
                  <img
                    src={
                     getMapPreviewImg(map.imageId)
                    }
                    alt={map.name}
                    onError={(e) => {
                      const target = e.target;
                      target.onerror = null; 
                      target.src = landing2;
                    }}
                    />
                  <div className="info">
                    <div className="category">Event</div>
                    <h4>{map.name}</h4>
                    <p style={{fontSize: 'var(--body)', color: 'var(--background-four)'}}><strong>Number of booths:</strong> {map.booths}</p>
                    {/* <p className="capacity"><strong>Updated at: </strong>{formatDateTime(map.updated_at)}</p> */}
                  </div>
                </MapCard>
              ))}
            </MapGrid>
          </>
          )}
          {step === 3 && subscriptionPlan && (
            <SubscriptionCard>
              <SubscriptionHeader>
                <h3>{subscriptionPlan.planName} Plan</h3>
                <span>${subscriptionPlan.price}</span>
              </SubscriptionHeader>

              <SubscriptionGrid>
                <div>
                  <label>Max Rooms</label>
                  <span>{subscriptionPlan.nbOfRooms}</span>
                </div>
                <div>
                  <label>Max Duration</label>
                  <span>{subscriptionPlan.maxDuration} mins</span>
                </div>
              </SubscriptionGrid>

              {eventData.subscriptionId !== '' ? <SuccessMessage><CheckIcon/>Purchased!</SuccessMessage>:
              <PurchaseButton onClick={createSubscriptionPlan}>
                Purchase
              </PurchaseButton>}
          </SubscriptionCard>
          )}
          <ErrorMessage message={errorMsg} style={{marginTop: "10px"}}/>
          <Footer>
            {step > 1 && <Button3 onClick={onBackClick} style={{backgroundColor: 'var(--host-bg-light)'}}>Back</Button3>}
            {step < 3 ?(<> <div></div><Button3 onClick={onNextClick} style={{backgroundColor: 'var(--host-bg-light)'}}>Next</Button3></>) : 
                <Button3 onClick={onSubmitClick} style={{backgroundColor: 'var(--host-bg-light)'}}>{loading ? <LoadingSpinner/> : 'Create!'}</Button3>}
          </Footer>
        </Modal>,
        document.body
      )}
      <Button3 onClick={openModal}>Host Event</Button3>
    </>
  );
}