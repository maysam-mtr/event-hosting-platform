import styled from "styled-components";
import { PageTitle, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png'
import { Button3 } from "../../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import Popup from "../../../components/Popup/Popup";
import formatDateTime from "../../../utils/formatDateTime";

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
  
  text-align: left;
  gap: 0.7rem;
  border: 1px solid var(--border-color);
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const EventTitle = styled.h3`
  max-width: 100%;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
`;

export const StatusIndicator = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${(props) => 
    props.$status === "live" ? "green" : 
    props.$status === "closed" ? "red" : "gray"};
  border-radius: 15px;
  padding: 5px 15px;
  background-color: ${(props) => 
    props.$status === "live" ? "rgba(0, 128, 0, 0.2)" : 
    props.$status === "closed" ? "rgba(255, 0, 0, 0.2)" : "rgba(169, 169, 169, 0.2)"};
  
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 15px;
    background-color: ${(props) => 
      props.$status === "live" ? "green" : 
      props.$status === "closed" ? "red" : "grey"};
    margin-right: 5px;
  }
`;


const HostName = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin: 5px 0;
`;

export const Schedule = styled.p`
  font-size: 0.9rem;
  color: #777;
`;

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const {user} = useUserState();
  const [sendRequest] = useSendRequest();
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

  useEffect(() => {
    getPublicEvents();
  }, []);

  async function getPublicEvents(){
    const URL = `/api/events/hosts/${user.id}`;

    const {request, response} = await sendRequest(URL);

    if(response?.success === true && response.data[0]?.events?.length > 0){
      setEvents(response.data[0].events);
    }else if(!response?.success){
      setEvents([])
      setPopup({message: 'Failed to retrieve events', type: 'fail', isVisible: true});
    }

  }

  const eventss = [
    {
      "id": "4e3682bd-f6ff-4e2a-829d-8630237ee2fb",
      "hostId": "fe4f6b2e-afad-467d-9c82-dcdb9b532406",
      "eventName": "Career Fair",
      "eventType": "public",
      "eventDate": "2025-05-15",
      "eventTime": "12:00:00",
      "subscriptionId": "2a7d913f-5f56-40d7-b7cb-3ced1c6dceff",
      "mapTemplateId": "123e4567-e89b-12d3-a456-426614174001",
      "createdAt": "2025-04-02T19:03:14.000Z",
      "updatedAt": "2025-04-02T19:03:14.000Z"
  }
  ];

  return (
    <Section>
      <Popup popUpSettings={popup}/>
      <PageTitle>My Events</PageTitle>
      <CardsWrapper>
        {events?.map((event) => (
          <Card key={event.id}>
            <PreviewImg src={previewImg} alt={event.eventName} />
            <EventTitle>{event.eventName}</EventTitle>
            {/* <StatusIndicator $status={event.status}>{event.status.toUpperCase()}</StatusIndicator> */}
            <Schedule><strong>Type:</strong> {event.eventType}</Schedule>
            <Schedule><strong>Scheduled at:</strong> {event.eventDate} - {event.eventTime}</Schedule>
            <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
            <Button3 style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}}>Edit(or view if past) Details</Button3>
          </Card>
        ))}
      </CardsWrapper>
    </Section>
  );
}
