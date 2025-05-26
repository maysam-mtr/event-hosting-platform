/**
 * Explore Events Page Component
 *
 * Event discovery and browsing interface for users:
 * - List and grid views of available events
 * - Search and filtering capabilities
 * - Event categories and type filtering
 * - Event details preview and quick join
 * - Pagination for large event lists
 *
 * Helps users discover interesting events to join
 * and provides detailed information for decision making.
 */

import { Button1 } from "../../../components/Navbar/Navbar";
import { Card, EventTitle, NotFoundMessage, PreviewImg, Schedule, StatusIndicator } from "../../HostPortal/MyEventsPage/MyEventsPage";
import { CardsWrapper, PageTitle, Section } from "../SettingsPage/SettingsPage";
import previewImg from '../../../assets/landing2.png';
import { useEffect, useState } from "react";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";
import formatDateTime from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import getEventStatus from "../../../utils/getEventStatus";
import styled from "styled-components";

const PagingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0 0;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: ${({ $active }) => ($active ? 'var(--general-bg-base)' : 'transparent')};
  border: 1px solid var(--border-color);
  color: ${({ $active }) => ($active ? '#fff' : 'var(--primary-color)')};
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--general-bg-base);
    color: white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Dots = styled.span`
  font-size: 1.2rem;
  color: var(--text-secondary);
  user-select: none;
`;

export default function ExploreEventsPage(){
  const [events, setEvents] = useState([]);
    const {user} = useUserState();
    const [sendRequest] = useSendRequest();
    const navigate = useNavigate();
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
    const [maps, setMaps] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
  
    useEffect(() => {
      getPublicEvents(currentPage);
    }, [currentPage]);

    // useEffect(() => {
    //   getMaps();
    // }, []);
  
    async function getPublicEvents(page = 1){
      const limit = 10;
      const URL = `/api/events/public?page=${page}&limit=${limit}`;
    
      const { request, response } = await sendRequest(URL);
      //console.log(response)
    
      if (response?.success === true) {
        const eventList = response.data;
    
        setEvents(eventList);
        setHasMore(eventList.length === limit); // if less than limit, no more pages
      } else {
        setEvents([]);
        setHasMore(false);
        setPopup({ message: 'Failed to retrieve events', type: 'fail', isVisible: true });
      }
    }

    async function getMaps(){
        const URL = '/api/latestMaps/getLatestMapsDisplay';
    
        const {request, response} = await sendRequest(URL, {}, 'maps');
        console.log(request, response)
    
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

    const getPageNumbers = (currentPage, hasMore) => {
      const pages = [];
    
      // Always show current page
      if (currentPage > 1) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (hasMore) pages.push(currentPage + 1);
    
      return pages;
    };
    
    
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
                  <Schedule><strong>Host: </strong>{event.hostName}</Schedule>
                  <Schedule><strong>Scheduled at:</strong>{formatDateTime(`${event.startDate}T${event.startTime}`)}</Schedule>
                  <Schedule><strong>Created at:</strong> {formatDateTime(event.createdAt)}</Schedule>
                  <Button1 style={{fontSize: 'var(--body)', alignSelf: 'center', marginTop: '10px'}} 
                      onClick={()=> {navigate(`/event/details/${event.id}`, {replace: true})}}>View Details</Button1>
                </Card>
              ))}
            </CardsWrapper>
            {events?.length > 0 ? <PagingWrapper>
              <PageButton onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
                ◀ Prev
              </PageButton>

              {currentPage > 2 && (
                <>
                  <PageButton onClick={() => setCurrentPage(1)}>1</PageButton>
                  <Dots>...</Dots>
                </>
              )}

              {getPageNumbers(currentPage, hasMore).map((page) => (
                <PageButton
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  $active={page === currentPage}
                >
                  {page}
                </PageButton>
              ))}

              {hasMore && (
                <>
                  <Dots>...</Dots>
                  <PageButton onClick={() => setCurrentPage(prev => prev + 1)}>
                    {currentPage + 2}
                  </PageButton>
                </>
              )}

              <PageButton onClick={() => setCurrentPage(prev => prev + 1)} disabled={!hasMore}>
                Next ▶
              </PageButton>
            </PagingWrapper> :
            <NotFoundMessage>No events found.</NotFoundMessage>}
        </Section>
    )
}