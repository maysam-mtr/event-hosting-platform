import styled from "styled-components";
import { PageTitle, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png'
import { Button3 } from "../../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import Popup from "../../../components/Popup/Popup";
import formatDateTime from "../../../utils/formatDateTime";
import Input from "../../../components/Input/Input";
import getEventStatus from "../../../utils/getEventStatus";
import { useNavigate } from "react-router-dom";

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;

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
  text-align: start;
`;

export const StatusIndicator = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${(props) => 
    props.$status === "ongoing" ? "green" : 
    props.$status === "past" ? "red" : 
    props.$status === "future" ? "orange" : "gray"};
  border-radius: 15px;
  padding: 5px 15px;
  max-width: fit-content;
  background-color: ${(props) => 
    props.$status === "ongoing" ? "rgba(0, 128, 0, 0.2)" : 
    props.$status === "past" ? "rgba(255, 0, 0, 0.2)" : 
    props.$status === "future" ? "rgba(255, 165, 0, 0.2)" : "rgba(169, 169, 169, 0.2)"};
  
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 15px;
    background-color: ${(props) => 
      props.$status === "ongoing" ? "green" : 
      props.$status === "past" ? "red" : 
      props.$status === "future" ? "orange" : "grey"};
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

export const PageSubtitle = styled.div`
color: var(--text-primary);
font-size: var(--heading-4);
font-weight: 500;
`;

export const NotFoundMessage = styled.p`
text-align: center; 
width: 100%;
color: gray;
font-size: 1.2rem;
`;

export default function MyEventsPage() {
  const {user} = useUserState();
  const [sendRequest] = useSendRequest();
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("all");

  const [maps, setMaps] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(status);
  }, [status]);

  useEffect(() => {
    getMaps();
  }, []);

  async function fetchEvents(status) {
    if(status === 'all'){
      
      const URL = `/api/events/hosts/${user.id}`;

      const {request, response} = await sendRequest(URL);
      console.log(response)
  
      if(response?.success === true && response.data?.length > 0){
        const eventsList = response.data;
        //console.log(eventsList)
        setEvents(eventsList);
      }else if(!response?.success){
        setEvents([])
        setPopup({message: 'Failed to retrieve events', type: 'fail', isVisible: true});
      }else if(response?.success === true && response.data?.length == 0){
        setEvents([]);
      }

    }else {
      const URL = `/api/events/filter/${user.id}`;
      const INIT = { method: 'POST', body: JSON.stringify({ status: status }) };

      const { request, response } = await sendRequest(URL, INIT);
      //console.log(response)
      if (response?.success === true && response.data[0]?.events?.length > 0) {
        const eventsList = response.data[0].events;
        setEvents(eventsList);
      } else if (!response?.success) {
        setEvents([]);
        setPopup({ message: 'Failed to retrieve events', type: 'fail', isVisible: true });
      }else if(response?.success === true && response.data[0]?.events.length == 0){
        setEvents([]);
      }

    }
  }

  const viewEventDetails = (id) => {
    navigate(`/host/eventDetails/${id}`);
  }

  async function getMaps(){
    const URL = '/api/latestMaps/getLatestMapsDisplay';

    const {response} = await sendRequest(URL, {}, 'maps');
    console.log(response)

    if(response?.statusCode === 200){
      setMaps(response.data)
    }else{
      setMaps([])
      setPopup({message: "Error loading map images. Please Try again!", type: 'fail', isVisible: true});
    }
  }

    const getMapPreviewImg = (mapId) => {
        if(!mapId){
          return previewImg;
        }
    
        return import.meta.env.VITE_SUPABASE_IMG_URL +  mapId + '.png';          
    }

  return (
    <Section>
      <Popup popUpSettings={popup}/>
      <PageTitle>My Events</PageTitle>
      <Input name={'status'} 
             id='status' 
             type="dropdown" 
             options={[{name: "All", value: "all"}, 
                      {name: "Ongoing", value: "ongoing"}, 
                      {name: "Future", value: "future"},
                      {name: "Past", value: "past"}]}
              data={status}
              setData={setStatus}
              label={'Filter: '}
              style={{width: '100px'}}
              role="host"/>
      <CardsWrapper>
        {events?.map((event) => (
          <Card key={event.id}>
            <PreviewImg src={getMapPreviewImg(event.mapTemplateId)} 
              alt={event.eventName} 
              onError={(e) => {
                const target = e.target;
                target.onerror = null; 
                target.src = previewImg;
              }}/>
            <EventTitle>{event.eventName}</EventTitle>
            <StatusIndicator style={{alignSelf: 'center'}} $status={event.status || status.toLowerCase()}>
              {event.status ? 
                getEventStatus(event.status) : status !== 'All' ? 
                getEventStatus(status) : 'Unknown'}
            </StatusIndicator>
            <Schedule><strong>Type:</strong> {event.eventType}</Schedule>
            <Schedule><strong>Scheduled at:</strong> {formatDateTime(`${event.startDate}T${event.startTime}`)}</Schedule>
            <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
            <Button3 
              style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}} 
              onClick={()=>viewEventDetails(event.id)}>{status === 'future' ? 'View or Edit' : event?.status === 'future' ? 'View or Edit': 'View Details'}</Button3>
          </Card>
        ))}
        {events.length == 0 && 
          <NotFoundMessage>No events found.</NotFoundMessage>}
      </CardsWrapper>
    </Section>
  );
}
