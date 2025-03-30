import styled from "styled-components";
import { PageTitle, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png'
import { Button3 } from "../../../components/Navbar/Navbar";

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Card = styled.div`
  min-width: 250px;
  max-width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const EventTitle = styled.p`
  font-size: 1.2rem;
  margin: 5px 0;
`;

const StatusIndicator = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  margin: 5px 0;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => 
      props.status === "live" ? "green" : 
      props.status === "closed" ? "red" : "gray"};
    margin-right: 5px;
  }
`;

const HostName = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin: 5px 0;
`;

const Schedule = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin: 5px 0;
`;

const DetailsButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #0056b3;
  }
`;

export default function MyEventsPage() {
  const events = [
    {
      id: 1,
      preview: previewImg, 
      name: "Tech Conference 2025",
      status: "live",
      host: "John Doe",
      dateTime: "April 10, 2025 - 3:00 PM",
    },
    {
      id: 2,
      preview: previewImg, 
      name: "Startup Pitch Night",
      status: "upcoming",
      host: "Jane Smith",
      dateTime: "April 15, 2025 - 6:00 PM",
    },
    {
      id: 3,
      preview: previewImg, 
      name: "AI & Machine Learning Summit",
      status: "closed",
      host: "Michael Johnson",
      dateTime: "March 20, 2025 - 10:00 AM",
    },
  ];

  return (
    <Section>
      <PageTitle>My Events</PageTitle>
      <CardsWrapper>
        {events.map((event) => (
          <Card key={event.id}>
            <PreviewImg src={event.preview} alt={event.name} />
            <EventTitle>{event.name}</EventTitle>
            <StatusIndicator status={event.status}>{event.status.toUpperCase()}</StatusIndicator>
            <Schedule>{event.dateTime}</Schedule>
            <Button3 style={{fontSize: 'var(--body)'}}>View Details</Button3>
          </Card>
        ))}
      </CardsWrapper>
    </Section>
  );
}
