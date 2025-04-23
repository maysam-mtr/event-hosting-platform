import { Navigate, useNavigate, useParams } from "react-router-dom";
import useUserState from "../../hooks/use-user-state";
import { useEffect, useState } from "react";
import useSendRequest from "../../hooks/use-send-request";
import formatDateTime from "../../utils/formatDateTime";
import previewImg from '../../assets/landing2.png';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styled from "styled-components";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";
import Input from "../../components/Input/Input";
import FileUpload from "../../Supabase/FileUpload";
import {Button1} from '../../components/Navbar/Navbar'
import Popup from "../../components/Popup/Popup";
import ImageInput from "../../components/ImageInput/ImageInput";
import { uploadImage } from "../../Supabase/uploadImage";
import StatusPopup from "../../components/StatusPopup/StatusPopup";
import { FaArrowLeft } from "react-icons/fa";
import { BackButton } from "../EventDetailsPage/EventDetailsPage";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
`;

const CardTitle = styled.h1`
  font-size: var(--heading-1);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--general-bg-base);
  text-align: center;
`;


const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--general-bg-base);
  box-shadow: 0 0 30px rgba(241, 134, 80, 0.3);
  border-radius: 12px;
  overflow: hidden;
  width: 90%;
  max-width: 1000px;
  padding: 40px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #000;
`;

const InfoItem = styled.div`
  font-size: 16px;
  color: #333;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export default function InvitationPage(){
    const {user, setUser} = useUserState();
    const {eventId} = useParams();
    const [sendRequest] = useSendRequest();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [eventDetails, setEventDetails] = useState({});
    const [invitationStatus, setInvitationStatus] = useState('');
    const [invitation, setInvitation] = useState({})

    const [partnerInfo, setPartnerInfo] = useState({
        companyName: "",
        companyLogo: '',
        primaryContactFullName: '',
        primaryContactEmail: ''
    })

    const [imageFile, setImageFile] = useState(null);
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});


    useEffect(() => {
        getEventInfo();
        getEventInvitations();
    }, []);

    async function getEventInfo(){
        const URL = `/api/events/details/${eventId}`;
        const {request, response} = await sendRequest(URL);
        
        if(response?.success === false){
            setError("An Error occured. Try Again!");
            return;
        }else if(response?.success === true && response?.data){
            const eventData = response.data[0];
            console.log(eventData)
            //setError(null);

            if(eventData.isOngoing.status !== 'future'){
                navigate('/errors', {state: {
                    errorCode: "403",
                    errorMessage: "You're too late on this invitation...",
                    errorTitle: "Event already launched"
                }, replace: true})
            }

            setEventDetails({
                eventName: eventData.eventName,
                hostName: eventData.hostName,
                code: eventData.id,
                createdAt: eventData.createdAt && formatDateTime(eventData.createdAt),
                updatedAt: eventData.updatedAt && formatDateTime(eventData.updatedAt),
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                eventType: eventData.eventType,
                eventStatus: eventData.isOngoing.status || 'unknown',
                gameMapName: "Central Park",
                previewImageUrl: previewImg,
            })
        }
    }

    async function getEventInvitations(){
        const URL = `/api/invitations/events/${eventId}`;

        const {response} = await sendRequest(URL);
        console.log(response)

        if(response?.success === true){
            setInvitation(response.data[0].invitation);
            
        }else if(response?.success === false && response.error[0]?.message === 'No pending invitation found for this event and user.'){
            setError('Oops! You are not invited...');
        }else{
            setError('Error loading invitations');
        }

        setLoading(false);
    }

    const onSubmitPartnerInfo = async(e) => {
        e.preventDefault();
        if(!partnerInfo.companyName || !partnerInfo.primaryContactEmail || !partnerInfo.primaryContactFullName || !imageFile){
            setPopup({message: 'Missing fields!', type: 'fail', isVisible: true});
            return;
        }

        try {
            let imageUrl = "";
            let payload = {
                ...partnerInfo,
            };


            if (imageFile && partnerInfo.companyLogo === '') {
              imageUrl = await uploadImage(imageFile);
              console.log(imageUrl)

              payload = {
                ...partnerInfo,
                companyLogo: imageUrl,
              };

              setPartnerInfo(payload)
            }
      
            console.log("Final payload for DB:", payload);
            acceptNewPartner(payload)
            // submit payload to backend/db
      
        } catch (err) {
            setPopup({message:`Image upload failed: ${err.message}`, type: 'fail', isVisible: true});
        }
    }

    async function acceptInvitation(){
        const URL = `/api/invitations/partners/${invitation.id}/accept`;

        const INIT = {method: 'PUT', body: JSON.stringify({})};

        const {response} = await sendRequest(URL, INIT);
        
        if(response?.success === true){
            //put success card
            setInvitationStatus('accepted');
        }else{
            console.log(response)
            setPopup({message: response.error[0].message || 'Something went wrong. Try Again!', type: 'fail', isVisible: true});
            return;
        }
    }

    async function rejectInvitation(){
        const URL = `/api/invitations/${invitation.id}/reject`;
        const INIT = {method: 'PUT', body: JSON.stringify({})};

        const {response} = await sendRequest(URL, INIT);
        
        if(response?.success === true){
            //put success card
            setInvitationStatus('rejected');
        }else{
            console.log(response)
            setPopup({message: 'Something went wrong. Try Again!', type: 'fail', isVisible: true});
            return;
        }
    }

    async function acceptNewPartner(body){
        const URL = `/api/invitations/partners/register/${invitation.id}/accept`;
        const INIT = {method: 'POST', body: JSON.stringify(body)};

        const {response} = await sendRequest(URL, INIT);

        if(response?.success === true){
            //put success card
            setUser((prev) => ({...prev, isPartner: 1}));
            setInvitationStatus('accepted');
            //change user isPartner to 1
        }else{
            console.log(response)
            setPopup({message: 'Something went wrong. Try Again!', type: 'fail', isVisible: true});
            return;
        }
    }

    if(error){
        return(
            <>
               <BackButton onClick={() => navigate("/", {replace: true})}>
                    <FaArrowLeft />
                    Back To Home
                </BackButton>
                <ErrorPopup message={error} />
            </>
        );
    }

    if(invitationStatus !== ''){
        return(
            <>
                <BackButton onClick={() => navigate("/", {replace: true})}>
                    <FaArrowLeft />
                    Back To Home
                </BackButton>
                <StatusPopup message={invitationStatus === 'accepted' ? "Invitation accepted. See you then!" :
                    "Invitation rejected: Hope to see you another time!"} type={invitationStatus === 'accepted' ? 'success' : 'neutral'}/>
            </>
        );
    }

    if(loading){
        return (
            <LoadingSpinner/>
        )
    }

    return (
        <Container>
            <Popup popUpSettings={popup}/>
            <BackButton onClick={() => navigate("/", {replace: true})}>
                    <FaArrowLeft />
                    Back To Home
                </BackButton>
            <Card>
                <CardTitle>Invitation Card</CardTitle>
                <PreviewImage src={eventDetails.previewImageUrl} alt="Preview" />
                <ContentWrapper>
                <Title>{eventDetails.eventName}</Title>
                <InfoItem><strong>Hosted by:</strong> {eventDetails.hostName}</InfoItem>
                <InfoItem><strong>Event Type:</strong> {eventDetails.eventType}</InfoItem>
                <InfoItem><strong>Event Code:</strong> {eventDetails.code}</InfoItem>
                <InfoItem><strong> Start Date:</strong> {formatDateTime(`${eventDetails.startDate}T${eventDetails.startTime}`)}</InfoItem>
                <InfoItem><strong>End Date:</strong> {formatDateTime(`${eventDetails.endDate}T${eventDetails.endTime}`)}</InfoItem>
                <InfoItem><strong>Created At:</strong> {eventDetails.createdAt}</InfoItem>

                <Title style={{ marginTop: "2rem" }}>Respond to Invitation</Title>

                {user.isPartner === 0 ? (
                    <Form>
                    <Input
                        label="Company Name"
                        name="companyName"
                        type="text"
                        placeholder={'enter company name'}
                        data={partnerInfo}
                        setData={setPartnerInfo}
                    />
                    {/* <Input
                        label="Company Logo"
                        type="file"
                        name={'companyLogo'}
                        data={partnerInfo}
                        setData={setPartnerInfo}
                    /> */}
                    {/* <FileUpload/> */}
                    <ImageInput 
                        label="Company Logo"
                        name={'companyLogo'}
                        required={true}
                        setFile={setImageFile}/>
                    <Input
                        label="Primary Contact Full Name"
                        name="primaryContactFullName"
                        type="text"
                        placeholder={'enter full name'}
                        data={partnerInfo}
                        setData={setPartnerInfo}
                    />
                    <Input
                       label="Primary Contact Email"
                       name="primaryContactEmail"
                       type="email"
                       placeholder={'enter full name'}
                       data={partnerInfo}
                       setData={setPartnerInfo}
                    />
                    <ActionButtons>
                        <div style={{width: '71%'}}></div>
                        <Button1 onClick={onSubmitPartnerInfo}>Submit & Accept</Button1>
                        <Button1 onClick={rejectInvitation}>Reject</Button1>
                    </ActionButtons>
                    </Form>
                ) : (
                    <ActionButtons>
                        <div style={{width: '71%'}}></div>
                        <Button1 onClick={acceptInvitation}>Accept</Button1>
                        <Button1 onClick={rejectInvitation}>Reject</Button1>
                    </ActionButtons>
                )}
                </ContentWrapper>
            </Card>
        </Container>
    );
}