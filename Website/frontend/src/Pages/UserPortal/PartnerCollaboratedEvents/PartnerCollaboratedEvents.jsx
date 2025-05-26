/**
 * Partner Collaborated Events Page Component
 *
 * Dashboard for partners to manage their booth participation:
 * - List of events where user has booth presence
 * - Booth management and customization options
 * - Collaboration tools and partner resources
 * - Event-specific booth analytics and engagement
 * - Partner-only features and capabilities
 *
 * Specialized interface for partners to manage their
 * booth presence and collaboration in multiple events.
 */

import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import { useNavigate } from "react-router-dom";
import { PageTitle, Section } from "../SettingsPage/SettingsPage";
import { Card, CardsWrapper, EventTitle, NotFoundMessage, PreviewImg, Schedule, StatusIndicator } from "../../HostPortal/MyEventsPage/MyEventsPage";
import formatDateTime from "../../../utils/formatDateTime";
import { Button1 } from "../../../components/Navbar/Navbar";
import previewImg from '../../../assets/landing2.png';
import getEventStatus from "../../../utils/getEventStatus";

export default function PartnerCollaboratedEvents(){
const [events, setEvents] = useState([]);
    const {user} = useUserState();
    const [sendRequest] = useSendRequest();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  
    useEffect(() => {
      getPartnerEvents();
    }, []);
  
    async function getPartnerEvents(){
      const URL = `/api/boothDetails/partners/${user.partnerId}`;
    
      const { request, response } = await sendRequest(URL);
      console.log(response)
    
      if (response?.success === true) {
        const eventList = response.data[0].booths;
    
        setEvents(eventList);
      } else {
        setEvents([]);
        setPopup({ message: 'Failed to retrieve events', type: 'fail', isVisible: true });
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
            <PageTitle>Collaborated Events</PageTitle>
            <CardsWrapper>
              {events?.map((event) => (
                <Card key={event.id}>
                  <PreviewImg src={getMapPreviewImg(event.Event.mapTemplateId)} 
                    alt={event.Event.eventName} 
                    onError={(e) => {
                      const target = e.target;
                      target.onerror = null; 
                      target.src = previewImg;
                  }}/>
                  <EventTitle>{event.Event.eventName}</EventTitle>
                  <StatusIndicator style={{alignSelf: 'center'}} $status={event.status}>{getEventStatus(event.status)}</StatusIndicator>
                  <Schedule><strong>Host: </strong>{event.Event.Host.fullName}</Schedule>
                  <Schedule><strong>Scheduled at:</strong>{formatDateTime(`${event.Event.startDate}T${event.Event.startTime}`)}</Schedule>
                  <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
                  <Button1 style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}} 
                      onClick={()=> {navigate(`/event/details/${event.Event.id}`, {replace: true})}}>View Details</Button1>
                </Card>
              ))}
            </CardsWrapper>
            {events?.length === 0 && <NotFoundMessage>No events found.</NotFoundMessage>}
        </Section>
    )
}