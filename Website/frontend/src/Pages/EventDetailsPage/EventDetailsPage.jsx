import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";
import { Button1 } from "../../components/Navbar/Navbar";
import { StatusIndicator } from "../HostPortal/MyEventsPage/MyEventsPage";
import { OrangeShape, OverlayShape } from "../SignUpPage/SignUpPage";
import { FaArrowLeft } from "react-icons/fa";
import useSendRequest from "../../hooks/use-send-request";
import formatDateTime from "../../utils/formatDateTime";
import { useEffect, useState } from "react";
import previewImg from '../../assets/landing2.png';
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { Button } from "../UserPortal/HomePage/HomePage";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90vh;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: var(--general-bg-base);
  }

  svg {
    margin-right: 8px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--border-color);
  box-shadow: 0 0 30px rgba(241, 134, 80, 0.3);
  border-radius: 12px;
  overflow: hidden;
  width: 90%;
  max-width: 1200px;
  padding: 40px;
  z-index: 1;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;

  @media (min-width: 768px) {
    width: 40%;
    height: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;

  @media (min-width: 768px) {
    width: 60%;
  }
`;

const MainInfo = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #333;
`;

const InfoItem = styled.div`
  font-size: 16px;
  color: #666;
`;

export const ModalContainer = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`;

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [sendRequest] = useSendRequest();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    eventName: "Battle Royale Showdown",
    hostName: "Gaming Arena",
    code: 'jggfyufufu',
    createdAt: "2025-03-25",
    scheduledTime: "2025-04-01T18:00",
    eventType: "Tournament",
    eventStatus: "live",
    gameMapName: "Desert Storm",
    previewImageUrl: previewImg,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getEventDetails();
  }, [])

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function getEventDetails(){
    const URL = `/api/events/details/${eventId}`;
    const {request, response} = await sendRequest(URL);

    if(response?.success === false){
      setError("An Error occured. Try Again!");
      return;
    }else if(response?.success === true && response?.data){
      const eventData = response.data[0];
      setError("");
      setEventDetails({
        eventName: eventData.eventName,
        hostName: eventData.hostName,
        code: eventData.id,
        createdAt: eventData.createdAt && formatDateTime(eventData.createdAt),
        scheduledTime: "2025-04-01T18:00",
        eventType: eventData.eventType,
        eventStatus: "live",
        gameMapName: "Desert Storm",
        previewImageUrl: previewImg,
      })
    }
  }

  async function OnJoinEvent(){
    //open  game
  }

  async function validateCredentials(password){
    setLoading(true);
    if(!passcode){
      setError("Passcode is required");
      setLoading(false);
      return;
    }

    const URL = `/api/events/${eventDetails.code}/join`;
    const INIT = {method: 'POST', body: JSON.stringify({passcode: password})}
    const {request, response} = await sendRequest(URL, INIT);

    if(response?.success === false){
      setError(response.error[0]?.message);
      setLoading(false);
      return;
    }else if (response.success === true){
      //navigate to game space
    }
    setLoading(false);
  }

  return (
    <Container>
      <OverlayShape />
      <OrangeShape />
      <BackButton onClick={() => navigate("/", {replace: true})}>
        <FaArrowLeft />
        Back
      </BackButton>
      <Card>
        {/* Preview Image */}
        <PreviewImage src={eventDetails.previewImageUrl} alt="Game Preview" />
        <ContentWrapper>
          <MainInfo>
            <TitleWrapper>
              <Title>{eventDetails.eventName}</Title>
              <StatusIndicator $status={eventDetails.eventStatus} style={{ fontSize: "var(--heading-6)" }}>
                {eventDetails.eventStatus}
              </StatusIndicator>
            </TitleWrapper>
            <InfoItem>
              <strong>Host:</strong> {eventDetails.hostName}
            </InfoItem>
            <InfoItem>
              <strong>Code:</strong> {eventDetails.code}
            </InfoItem>
            <InfoItem>
              <strong>Created At:</strong> {eventDetails.createdAt}
            </InfoItem>
            <InfoItem>
              <strong>Scheduled Time:</strong>{" "}
              {new Date(eventDetails.scheduledTime).toLocaleString()}
            </InfoItem>
            <InfoItem>
              <strong>Event Type:</strong> {eventDetails.eventType}
            </InfoItem>
            <InfoItem>
              <strong>Map Name:</strong> {eventDetails.gameMapName}
            </InfoItem>
          </MainInfo>

          {eventDetails.eventStatus === "live" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button1 onClick={eventDetails.eventType === 'public' ? OnJoinEvent: openModal}>Join Event</Button1>
            </div>
          )}
        </ContentWrapper>
      </Card>
      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Enter Password">
          <Input
              type="text"
              placeholder="Enter Event code"
              name='passcode'
              data={passcode}
              setData={setPasscode}
              required={true}
              label='Passcode'
          />
      
          <ErrorMessage message={error}/>
                    
          <Button onClick={() => validateCredentials(passcode)} style={{alignSelf: 'end'}}>{loading ? <LoadingSpinner/> : 'Join!'}</Button>
      </Modal>
    </Container>
  );
}
