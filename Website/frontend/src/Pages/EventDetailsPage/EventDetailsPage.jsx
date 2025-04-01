import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";
import { Button1 } from "../../components/Navbar/Navbar";
import { StatusIndicator } from "../HostPortal/MyEventsPage/MyEventsPage";
import { OrangeShape, OverlayShape } from "../SignUpPage/SignUpPage";
import { FaArrowLeft } from "react-icons/fa";

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
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 40px;
  z-index: 1;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;

  @media (min-width: 768px) {
    width: 40%;
    height: auto;
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
  margin-bottom: 20px;
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
  margin: 5px 0;
  font-size: 16px;
  color: #666;
`;

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate(); // Use navigate hook for routing

  const eventDetails = {
    eventName: "Battle Royale Showdown",
    hostName: "Gaming Arena",
    createdAt: "2025-03-25",
    scheduledTime: "2025-04-01T18:00",
    eventType: "Tournament",
    eventStatus: "live", // Change this for testing status "live", "closed", "not started"
    gameMapName: "Desert Storm",
    previewImageUrl: "https://dummyimage.com/600x400/000/fff&text=Game+Preview",
  };

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
            <Button1 onClick={() => alert("Joining Event...")}>
              Join Event
            </Button1>
          )}
        </ContentWrapper>
      </Card>
    </Container>
  );
}
