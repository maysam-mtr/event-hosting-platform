import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { useState } from "react";
import Input from '../../../components/Input/Input';
import useUserState from '../../../hooks/use-user-state';
import Popup from '../../../components/Popup/Popup';
import useSendRequest from '../../../hooks/use-send-request';

const Container = styled.div`
  max-width: 100%;
  padding: 20px;
`;

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Card = styled.div`
  flex: 1;
  min-width: 250px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

export const ProfileCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 0.5; /* Keeps it smaller */

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const ProfileCard = styled(Card)`
  display: flex;
  align-items: center;
  min-height: 120px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfilePic = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  padding: 10px;
  border: 3px solid var(--general-bg-base);

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Text = styled.p`
  margin: 5px 0;
  color: ${({ $secondary }) => ($secondary ? "gray" : "black")};
  font-weight: ${({ $bold }) => ($bold ? "bold" : "normal")};
`;

const EditableDetails = styled.div`
  /*display: flex;
  flex-direction: column;
  gap: 15px;*/
    display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const UpdateButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--general-bg-base);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: var(--general-bg-base-hover);
  }
`;

export const PageTitle = styled.div`
border-bottom: 2px solid #ddd;
color: var(--text-primary);
font-size: var(--heading-2);
font-weight: 600;
padding: 10px 0;
`;

export const Section = styled.div`
padding: 30px;
display: flex;
gap: 20px;
flex-direction: column;
`;

export default function SettingsPage() {
  const { user, setUser } = useUserState();
  const [sendRequest] = useSendRequest();

  const [userData, setUserData] = useState({
    //profilePic: user.profilePic || profile,
    dateOfBirth: user.dateOfBirth || "",
    phone: user.phone || "",
    location: user.country || "",
    educationLevel: user.educationLevel || "",
    fieldOfStudy: user.fieldOfStudy || "",
    preferredEventType: user.preferredEventType || "",
    yearsOfExperience: user.yearsOfExperience || "",
    linkedin: user.linkedin || "",
    github: user.github || "",
  });

  const [partnerData, setPartnerData] = useState({
    company: user.company || "",
    position: user.position || "",
  });

  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

  async function updateUserInformation (){
    if(!userData.phoneNumber){
      setPopup({message: 'Phone Number is required', type: 'fail', isVisible: true});
      return;
    }

    let URL = '/api/host/update';
    let INIT = {method: 'PUT', body: JSON.stringify(userData)}

    let {request, response} = await sendRequest(URL, INIT);

    if(response?.success){
      console.log({...response.data, role: 'host'}, response)
      const newHostInfo = {...response.data, role: 'host'};
      setUser(newHostInfo)
      localStorage.setItem("user", JSON.stringify({...newHostInfo, role: 'host'}));
      setPopup({message: 'Info updated!', type: 'success', isVisible: true});
    }else{
      setPopup({message: 'Failed to update! Try again', type: 'fail', isVisible: true});
      return;
    }
  }

  return (
    <Section>
      <Popup popUpSettings={popup}/>
      <PageTitle>Settings</PageTitle>
      <Container>
        <CardsWrapper>
          <ProfileCardWrapper>
            <ProfileCard>
              <ProfilePic src={user.profilePic || profile} alt="Profile" />
              <Info>
                <Text $bold>{user.fullName}</Text>
                <Text $secondary>{user.email}</Text>
                <Text $secondary>@{user.username}</Text>
              </Info>
            </ProfileCard>
            <UpdateButton onClick={updateUserInformation}>Update</UpdateButton>
          </ProfileCardWrapper>

          <Card>
            <EditableDetails>
              {Object.entries(userData).map(([key, value]) => (
                <div key={key}>
                  <Input label={key.replace(/([A-Z])/g, ' $1').trim()} 
                          type='text' 
                          name={key} 
                          data={userData} 
                          setData={setUserData} 
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}/>
                </div>
              ))}
            </EditableDetails>
          </Card>

          {user.isPartner === 1 && (
            <Card>
              <EditableDetails>
                {Object.entries(partnerData).map(([key, value]) => (
                  <div key={key}>
                    <Input label={key.replace(/([A-Z])/g, ' $1').trim()} 
                            type='text' 
                            name={key} 
                            data={userData} 
                            setData={setUserData} 
                            placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}/>
                  </div>
                                  ))}
              </EditableDetails>
            </Card>
          )}
        </CardsWrapper>
      </Container>
    </Section>
  );
}
