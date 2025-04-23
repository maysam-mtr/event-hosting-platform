import { useEffect, useState } from "react";
import styled from "styled-components";
import { StatusIndicator } from "../MyEventsPage/MyEventsPage";
import { OrangeShape, OverlayShape } from "../../SignUpPage/SignUpPage";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../UserPortal/HomePage/HomePage";
import Input from "../../../components/Input/Input";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import previewImg from '../../../assets/landing2.png';
import { Title } from "../../EventDetailsPage/EventDetailsPage";
import useSendRequest from "../../../hooks/use-send-request";
import useUserState from "../../../hooks/use-user-state";
import formatDateTime from "../../../utils/formatDateTime";
import getEventStatus from "../../../utils/getEventStatus";
import Popup from "../../../components/Popup/Popup";
import { BlueButton } from "../SettingsHostPage/SettingsHostPage";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import BoothMap from "./BoothMap";
import EditEventModal from "./EditEventModal";

const Container = styled.div`
  padding: 40px 20px;
  width: 100%;
  min-height: 100vh;
  background: #fdfdfd;
  box-sizing: border-box;
`;

const FullWidthContent = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const PreviewImage = styled.img`
  /*width: 500px;
  max-width: 100%;
  max-height: 400px;*/

  height: 350px;
  width: auto;

  object-fit: cover;
  border-radius: 12px;
`;

const InfoBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 12px 15px;
  margin-top: 16px;
  font-size: var(--body);
  
  & > div {
    line-height: 1.4;
  }
`;

const TitleWrapper = styled.div`
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Section = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 12px;
  margin-left: 10px;
  
  background-color: var(--background-three);
  outline: none;

    &:focus {
      border-color: var(--host-bg-light);
      box-shadow: 0 0 5px rgba(58, 97, 209, 0.5);
    }
`;

const TagInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
`;

const EmailTag = styled.div`
  background-color: var(--host-bg-light);
  color: #fff;
  padding: 6px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;

  svg {
    margin-left: 6px;
    cursor: pointer;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const InviteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: var(--host-bg-base);
    color: white;
  }
`;

const EnterButton = styled.button`
  padding: 12px 16px;
  background-color: var(--host-bg-base);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
  margin-top: 12px;

  &:hover {
    background-color: var(--host-bg-dark);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


export default function HostEventDetails() {
  const { eventId } = useParams();
  const {user} = useUserState();
  const [sendRequest] = useSendRequest();
    const [eventDetails, setEventDetails] = useState({
      eventName: '',
      hostName: '',
      code: '',
      endDate: '',
      startDate: '',
      startTime: '',
      endTime: '',
      status: 'closed',
      mapTemplateId: '',
      updatedAt: '',
      createdAt: '',
      eventPassword: '',
      eventType: "public",
      eventStatus: '',
      gameMapName: "Desert Storm",
      subscriptionId: '',
      previewImageUrl: previewImg,
    });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [acceptedPartners, setAcceptedPartners] = useState([]);
  const [mapDetails, setMapDetails] = useState({});
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  const [booths, setBooths] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [mapImage, setMapImage] = useState({});
  const [assignedEmail, setAssignedEmail] = useState({
    email: null,
    boothId: null
  })
  const [boothsMapping, setBoothsMapping] = useState([])
  const navigate = useNavigate();

  const addEmail = () => {
    const trimmed = assignedEmail.email?.trim();
    if (!trimmed || !assignedEmail.boothId) {
      setPopup({message: 'Missing fields', type: 'fail', isVisible: true});
        return;
    }  

    onInvitePartnerClick(assignedEmail.boothId, trimmed);
  };

  const removeEmail = (index) => {
    //setEmails((prev) => prev.filter((_, i) => i !== index));
    //setInviteStatus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  useEffect(() => {
    getEventDetails();
    getAcceptedPartners();
    //getMapDetails();
    // const loadAllData = async () => {
      
    //     await getEventDetails();
      
      
    // };
    // loadAllData();
  }, [])

    async function getEventDetails(){
      const URL = `/api/events/details/${eventId}`;
      const {request, response} = await sendRequest(URL);
  
      if(response?.success === false){
        setPopup({message: 'Error loading info. Try Again!', type: 'fail', isVisible: true});
        return;
      }else if(response?.success === true && response?.data){
        const eventData = response.data[0];
        //console.log(eventData)
        setError("");
        setEventDetails({
          eventName: eventData.eventName,
          hostName: eventData.hostName,
          code: eventData.id,
          endDate: eventData.endDate,
          startDate: eventData.startDate,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          status: eventData.isOngoing.status || 'unknown',
          mapTemplateId: eventData.mapTemplateId,
          updatedAt: eventData.updatedAt && formatDateTime(eventData.updatedAt),
          createdAt: eventData.createdAt && formatDateTime(eventData.createdAt),
          eventType: eventData.eventType,
          gameMapName: "Desert Storm",
          subscriptionId: eventData.subscriptionId,
          previewImageUrl: previewImg,
        })

        getMapDetails(eventData.mapTemplateId);
        getMapBoothsIds(eventData.mapTemplateId);

        if(eventData.eventType === 'private'){
            getEventCredentials();
        }
      }
    }

    async function getEventCredentials(){
        const URL = `/api/event/private/credentials/${eventId}`;
        const {response} = await sendRequest(URL);
        //console.log(response)

        if(response?.success === true && response.data){
            setEventDetails((prev) => ({...prev, eventPassword: response.data.passcode}))
        }else{
            setPopup({message: 'Error loading info. Try Again!', type: 'fail', isVisible: true});
        }
    }

    async function getMapBoothsIds(mapId){
        if(!mapId){
          return;
        }
  
        const URL = `/api/maps/getMapBoothsDisplay/${mapId}`;
  
        const {response} = await sendRequest(URL, {} , 'maps');
        console.log(response)
  
        if(response?.statusCode === 200){
            const boothsList = response.data?.booths || [];
            console.log(boothsList)
            setBooths(boothsList);
            setMapImage(response.data?.image)
            setPageLoad(false);
            const mappedBooths = boothsList.map((booth, index) => ({boothId: booth.id, boothDisplayId: index}))
            console.log(mappedBooths)
            setBoothsMapping(mappedBooths)
        }else if(response?.statusCode === 404){
          setPopup({message: 'No booths found', type: 'fail', isVisible: true});
          setPageLoad(false);
        }
        else{
            setPopup({message: 'Error loading map booths', type: 'fail', isVisible: true});
            setPageLoad(false);
        }
        
    }

    async function onInvitePartnerClick(boothId, assignedEmail){
        setLoading(true);
        const URL = `/api/invitations/invite/${eventDetails.code}`;
        const INIT = {method: 'POST', body: JSON.stringify({
            boothTemplateId: boothId,
            assignedEmail: assignedEmail,
            invitationLink: `http://localhost:5173/event/invitation/${eventId}`
        })}

        const {response} = await sendRequest(URL, INIT);
        console.log(response, URL, INIT)

        if(response?.success === true){
            setAssignedEmail((prev) => ({...prev, assignedEmail: ""}));
            setEmails((prev) => [...prev, assignedEmail])
        }else{
            setPopup({message: 'Something went wrong. Try again!', isVisible: true, type: 'fail'});
        }
        setLoading(false);
    }

    async function getInvitations(){
        const URL = `/api/invitations/events/${eventId}/getAll`;

        const {response} = await sendRequest(URL);
        console.log(response, response.error[0]?.message)

        if(response?.success === true){
            const invites = response.data[0]?.invitations;
            setInvitations(invites);
        }else if(response?.success === false && response.error[0]?.message === 'No invitations found for this event'){
          return;
        }else{
            setPopup({message: 'Error loading invitations', type: 'fail', isVisible: true});
        }
    }

    async function getAcceptedPartners(){
      const URL = `/api/events/booth-partner/${eventId}`;

      const {response} = await sendRequest(URL);
      console.log(response)

      if(response?.success === true){
          const partnersList = response.data[0]?.Partners;
          setAcceptedPartners(partnersList);
      }else{
          setPopup({message: 'Error loading partners', type: 'fail', isVisible: true});
      }
    }

    async function getMapDetails(mapId){
      if(!mapId){
        return;
      }

      console.log(mapId)

      const URL = `/api/maps/getMap/${mapId}`;

      const {response} = await sendRequest(URL, {} , 'maps');
      console.log(response)

      if(response?.statusCode === 200){
          const map = response.data;
          setMapDetails(map);
      }else if(response?.statusCode === 404){
        setPopup({message: 'No such map found', type: 'fail', isVisible: true});
      }
      else{
          setPopup({message: 'Error loading map details', type: 'fail', isVisible: true});
      }
    }

    const getMapPreviewImg = (mapId) => {
        if(!mapId){
          return previewImg;
        }
          
       return import.meta.env.VITE_SUPABASE_IMG_URL +  mapId;
                    
    }

    const getMappedBoothId = (boothid) => {
      const comparedBooth = boothsMapping.find((b) => b.boothId === Number(boothid));
      return comparedBooth?.boothDisplayId;
    }

    const joinEvent = () => {
      navigate('/event/space', {state: {eventId: eventId}});
    }

    useEffect(() => {
        getInvitations();
    }, [emails])

  return (
    <>
      {pageLoad === true ? 
      
      <LoadingSpinner role="host"/> 
      :
    <Container>
    <Popup popUpSettings={popup}/>
      <FullWidthContent>
        
          {/* <PreviewImage src={getMapPreviewImg(mapDetails.imageId)} alt="Event Preview" /> */}
          
          
          <InfoBlock>
            <TitleWrapper>
              <Title style={{fontSize: 'var(--heading-2)', marginBottom: '20px'}}>{eventDetails.eventName}</Title>
              <StatusIndicator $status={eventDetails.status} style={{ fontSize: "var(--heading-6)" }}>
                {getEventStatus(eventDetails.status)}
              </StatusIndicator>
            </TitleWrapper>
            <div><strong>Code:</strong> {eventDetails.code}</div>
            <div><strong>Nb of Booths:</strong> {booths?.length}</div>
            {eventDetails.eventType === 'private' && (
              <div><strong>Event Passcode:</strong> {eventDetails.eventPassword}</div>
            )}
            <div><strong>Starts at:</strong> {formatDateTime(`${eventDetails.startDate}T${eventDetails.startTime}`)}</div>
            <div><strong>Map Name:</strong> {mapDetails.name}</div>
            <div><strong>Ends at:</strong> {formatDateTime(`${eventDetails.endDate}T${eventDetails.endTime}`)}</div>
            <div><strong>Created At:</strong> {eventDetails.createdAt}</div>
            <div><strong>Event Type:</strong> {eventDetails.eventType}</div>
            <div><strong>Updated At:</strong> {eventDetails.updatedAt}</div>
            {eventDetails.eventType === 'public' && <div></div>}
            <div style={{marginTop: '20px', display: 'flex', justifyContent: "end"}}>
              {eventDetails.status === 'future' && <EditEventModal setPopup={setPopup} event={eventDetails} updatEventDetails={getEventDetails}/> }
              <EnterButton disabled={eventDetails.status !== 'ongoing'} onClick={joinEvent}>Join</EnterButton>
            </div>
          </InfoBlock>

          <Section>
          <Title style={{marginBottom: '20px'}}>Map Preview</Title>
            <BoothMap imageUrl={getMapPreviewImg(mapDetails.imageId)} booths={booths} map={mapImage}/>
          </Section>

        {/* Invite Emails Section */}
        {eventDetails.status === 'future' && 
        <Section style={{maxWidth: '600px'}}>
          <Title style={{marginBottom: '20px'}}>Invite Partners</Title>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            <Input label="Select Booth" 
                    type="dropdown" 
                    name="boothId" 
                    data={assignedEmail} 
                    setData={setAssignedEmail} 
                    placeholder="Enter booth id" 
                    required 
                    role="host"
                    style={{width: '150px', marginBottom: '10px'}}
                    options={booths.map((booth, index) => ({
                      value: booth.id,
                      // name: `#${booth.id}`
                      name: `#${index}`
                    }))}/>
            
            <EmailInput
              type="email"
              placeholder="Enter email and booth and press Enter"
              value={assignedEmail.email || ''}
              onChange={(e) => setAssignedEmail((prev) => ({...prev, email: e.target.value}))}
              onKeyDown={handleKeyPress}
            />

            <EnterButton onClick={addEmail} disabled={!assignedEmail.email?.trim()}>
              {loading ? <LoadingSpinner role="host"/> : 'Enter'}
            </EnterButton>
          </div>

          {/*<TagInputWrapper>
            {invitations?.map((email, index) => (
              <EmailTag key={index}>
                {email.assignedEmail}
                 <FaTimes onClick={() => removeEmail(index)} /> //remove
              </EmailTag>
            ))}
          </TagInputWrapper>*/}
          {/* <BlueButton>{loading ? <div><LoadingSpinner role="host"/></div> : 'Submit'}</BlueButton> */}
        </Section>}

        <Section>
          <Title >Registered Partners</Title>
          <TableWrapper>
            <InviteTable>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Booth id</th>
                </tr>
              </thead>
              <tbody>
                {acceptedPartners?.map((partner, idx) => (
                  <tr key={idx}>
                    <td>{partner.Partner.companyName}</td>
                    <td>{partner.Partner.primaryContactFullName}</td>
                    <td>{partner.Partner.User?.email}</td>
                    <td>{partner.boothTemplateId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </InviteTable>
          </TableWrapper>
        </Section>

        {/* Invitation Status Table */}
        <Section>
          <Title >Invitations Status</Title>
          <TableWrapper>
            <InviteTable>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Booth id</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invitations?.map((invite, idx) => (
                  <tr key={idx}>
                    <td>{invite.assignedEmail}</td>
                    <td>{getMappedBoothId(invite.BoothDetail?.boothTemplateId) || '-'}</td>
                    <td>{invite.status}</td>
                  </tr>
                ))}
              </tbody>
            </InviteTable>
          </TableWrapper>
        </Section>

        {/* <Section>
          <Title>Map Preview</Title>
          <BoothMap mapUrl={getMapPreviewImg(mapDetails.imageId)} booths={booths} mapWidth={'500px'}/>
        </Section> */}
      </FullWidthContent> </Container>}
    </>
  );
}