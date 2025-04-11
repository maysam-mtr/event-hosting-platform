import { Button3 } from "../../../components/Navbar/Navbar";
import { Card, EventTitle, PreviewImg, Schedule, StatusIndicator } from "../../HostPortal/MyEventsPage/MyEventsPage";
import { CardsWrapper, PageTitle, Section } from "../SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png';
import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import Popup from "../../../components/Popup/Popup";
import formatDateTime from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";

export default function ExploreEventsPage(){
  const [events, setEvents] = useState([]);
    const {user} = useUserState();
    const [sendRequest] = useSendRequest();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  
    useEffect(() => {
      getPublicEvents();
    }, [user]);
  
    async function getPublicEvents(){
      const URL = '/api/events/public';
  
      const {request, response} = await sendRequest(URL);
      //console.log(response)
  
      if(response?.success === true && response.data.length > 0){
        setEvents(response.data);
      }else if(!response?.success){
        setEvents([])
        setPopup({message: 'Failed to retrieve events', type: 'fail', isVisible: true});
      }
  
    }
    
    return (
        <Section>
            <PageTitle>Explore Public Events</PageTitle>
            <CardsWrapper>
              {events?.map((event) => (
                <Card key={event.id}>
                  <PreviewImg src={previewImg} alt={event.eventName} />
                  <EventTitle>{event.eventName}</EventTitle>
                  {/* <StatusIndicator $status={event.status}>{event.status.toUpperCase()}</StatusIndicator> */}
                  <Schedule><strong>Scheduled at:</strong> {event.startDate} - {event.startTime}</Schedule>
                  <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
                  <Button3 style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}} 
                      onClick={()=> {navigate(`/event/details/${event.id}`, {replace: true})}}>View Details</Button3>
                </Card>
              ))}
            </CardsWrapper>
        </Section>
    )
}