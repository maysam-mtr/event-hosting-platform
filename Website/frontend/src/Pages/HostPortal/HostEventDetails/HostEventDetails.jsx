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
import { Title, TitleWrapper } from "../../EventDetailsPage/EventDetailsPage";
import useSendRequest from "../../../hooks/use-send-request";
import useUserState from "../../../hooks/use-user-state";
import formatDateTime from "../../../utils/formatDateTime";
import getEventStatus from "../../../utils/getEventStatus";
import Popup from "../../../components/Popup/Popup";
import { BlueButton } from "../SettingsHostPage/SettingsHostPage";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

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
  width: 500px;
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
`;

const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  h2 {
    font-size: 32px;
  }
  div {
    font-size: 16px;
    color: #444;
  }
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
  margin-bottom: 10px;
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
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [inviteStatus, setInviteStatus] = useState([]);
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  const [boothCounter, setBoothCounter] = useState(5);
  const [booths, setBooths] = useState([
    {
        id: 1,
    },
    {
        id: 2
    },
    {
        id: 3
    },
    {
        id: 4
    },
    {
        id: 5
    }
  ]);
  const [invitations, setInvitations] = useState([]);

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed || emails.includes(trimmed)) {
        return;
    }

    if(boothCounter > 0){
        onInvitePartnerClick(booths[boothCounter-1]?.id, trimmed);
    }
    //setInviteStatus([...inviteStatus, { email: trimmed, status: "Pending" }]);
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

    async function getSubscrptionDetails(){

    }

    async function getMapBoothsIds(){
        setBoothCounter(5);
        return [
            {
                id: 1,
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            },
            {
                id: 5
            }
        ]
    }

    async function onInvitePartnerClick(boothId, assignedEmail){
        setLoading(true);
        console.log(boothId)
        const URL = `/api/invitations/invite/${eventDetails.code}`;
        const INIT = {method: 'POST', body: JSON.stringify({
            boothTemplateId: boothId,
            assignedEmail: assignedEmail,
            invitationLink: `http://localhost:5173/event/invitation/${eventId}`
        })}

        const {response} = await sendRequest(URL, INIT);
        console.log(response, URL, INIT)

        if(response?.success === true){
            setEmails([...emails, assignedEmail]);
            setEmailInput("");
            setBoothCounter((prev) => prev--);
        }else{
            setPopup({message: 'Something went wrong. Try again!', isVisible: true, type: 'fail'});
        }
        setLoading(false);
    }

    async function getInvitations(){
        const URL = `/api/invitations/events/${eventId}/getAll`;

        const {response} = await sendRequest(URL);
        console.log(response)

        if(response?.success === true){
            const invites = response.data[0]?.invitations;
            setInvitations(invites);
        }else if(response?.success === false && response.error[0]?.message === 'No invitations found for this event'){
        
        }else{
            setPopup({message: 'Error loading invitations', type: 'fail', isVisible: true});
        }
    }

    useEffect(() => {
        getInvitations();
    }, [emails])

  return (
    <Container>
    <Popup popUpSettings={popup}/>
      <FullWidthContent>
        <TopSection>
          <PreviewImage src={eventDetails.previewImageUrl} alt="Event Preview" />
          <InfoBlock>
            <TitleWrapper>
            <Title>{eventDetails.eventName}</Title>
            <StatusIndicator $status={eventDetails.status} style={{ fontSize: "var(--heading-6)" }}>
              {getEventStatus(eventDetails.status)}
            </StatusIndicator>
            </TitleWrapper>
            <div><strong>Code:</strong> {eventDetails.code}</div>
            <div><strong>Event Type:</strong> {eventDetails.eventType}</div>
            {eventDetails.eventPassword !== '' && <div><strong>Event Passcode:</strong> {eventDetails.eventPassword}</div>}
            <div><strong>Date:</strong> {eventDetails.startDate} {eventDetails.startDate == eventDetails.endDate ? null: ` - ${eventDetails.endDate}`}</div>
            <div><strong>Time:</strong> {eventDetails.startTime} - {eventDetails.endTime}</div>
            <div><strong>Map Name:</strong> Central Park</div>
            <div><strong>Created At:</strong> {eventDetails.createdAt}</div>
            <div><strong>Updated At:</strong> {eventDetails.updatedAt}</div>
          </InfoBlock>
        </TopSection>

        {/* Invite Emails Section */}
        {eventDetails.status === 'future' && 
        <Section style={{maxWidth: '600px'}}>
          <Title style={{marginBottom: '20px'}}>Invite Partners</Title>
          <EmailInput
            type="email"
            placeholder="Enter email and press Enter"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <TagInputWrapper>
            {invitations?.map((email, index) => (
              <EmailTag key={index}>
                {email.assignedEmail}
                {/* <FaTimes onClick={() => removeEmail(index)} /> */}
              </EmailTag>
            ))}
          </TagInputWrapper>
          <BlueButton>{loading ? <div><LoadingSpinner role="host"/></div> : 'Submit'}</BlueButton>
        </Section>}

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
                  <th>Expires at</th>
                </tr>
              </thead>
              <tbody>
                {invitations?.map((invite, idx) => (
                  <tr key={idx}>
                    <td>{invite.assignedEmail}</td>
                    <td>{invite.BoothDetail?.boothTemplateId || '-'}</td>
                    <td>{invite.status}</td>
                    <td>{invite.expiresAt}</td>
                  </tr>
                ))}
              </tbody>
            </InviteTable>
          </TableWrapper>
        </Section>
      </FullWidthContent>
    </Container>
  );
}