import { Button1, Button2, Button3 } from "../../../components/Navbar/Navbar";
import { Card, EventTitle, PreviewImg, Schedule, StatusIndicator } from "../../HostPortal/MyEventsPage/MyEventsPage";
import { CardsWrapper, PageTitle, Section } from "../SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png';
import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import Popup from "../../../components/Popup/Popup";
import formatDateTime from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import getEventStatus from "../../../utils/getEventStatus";

export default function ExploreEventsPage(){
  const [events, setEvents] = useState([]);
    const {user} = useUserState();
    const [sendRequest] = useSendRequest();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
    const [maps, setMaps] = useState([]);
  
    useEffect(() => {
      getPublicEvents();
      getMaps();
    }, [user]);
  
    async function getPublicEvents(){
      const URL = '/api/events/public';
  
      const {request, response} = await sendRequest(URL);
      //console.log(response)
  
      if(response?.success === true && response.data.length > 0){
        console.log(response.data)
        setEvents(response.data);
      }else if(!response?.success){
        setEvents([])
        setPopup({message: 'Failed to retrieve events', type: 'fail', isVisible: true});
      }
  
    }

    async function getMaps(){
        const URL = '/api/latestMaps/getLatestMapsDisplay';
    
        const {response} = await sendRequest(URL, {}, 'maps');
        //console.log(response)
    
        if(response?.statusCode === 200){
          setMaps(response.data)
        }else{
          setMaps([])
          setPopup({message: "Error loading map images. Please Try again!", type: 'fail', isVisible: true});
        }
    }
    
    const getMapPreviewImg = (mapId) => {
        const map = maps?.find(map => map.id === mapId);
        if(!map){
          return previewImg;
        }
    
        return `https://drive.google.com/thumbnail?id=${map.imageId}&sz=w320-h160`;
              
    }
    
    return (
        <Section>
            <PageTitle>Explore Public Events</PageTitle>
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
                  <StatusIndicator style={{alignSelf: 'center'}} $status={event.status}>{getEventStatus(event.status)}</StatusIndicator>
                  <Schedule><strong>Host: </strong>{event.hostname}</Schedule>
                  <Schedule><strong>Scheduled at:</strong>{event.startDate} {event.startTime}</Schedule>
                  <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
                  <Button1 style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}} 
                      onClick={()=> {navigate(`/event/details/${event.id}`, {replace: true})}}>View Details</Button1>
                </Card>
              ))}
            </CardsWrapper>
        </Section>
    )
}