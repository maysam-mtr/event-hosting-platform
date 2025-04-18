import { Card, CardsWrapper, PageTitle, ProfileCard, ProfileCardWrapper, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import Input from '../../../components/Input/Input';
import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { useState } from "react";
import Popup from "../../../components/Popup/Popup";
import useUserState from "../../../hooks/use-user-state";
import useSendRequest from "../../../hooks/use-send-request";

const Container = styled.div`
  max-width: 100%;
  padding: 20px;
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
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const BlueButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--host-bg-base);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: var(--host-bg-base-hover);
  }
`;

const ProfilePic = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  padding: 10px;
  border: 3px solid var(--host-bg-base);

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

export default function SettingsHostPage(){
  const {user, setUser} = useUserState();
  const [sendRequest] = useSendRequest();
  const [userData, setUserData] = useState({
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      companyWebsite: user.companyWebsite,
      companyIndustry: user.companyIndustry,
      businessRegistrationProof: user.businessRegistrationProof,
  });
    
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

    
  async function updateHostInformation (){
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
              {/* Profile Card (Static Info) */}
              <ProfileCardWrapper>
                  <ProfileCard>
                  <ProfilePic src={profile} alt="Profile" />
                  <Info>
                      <Text $bold>{userData.companyName}</Text>
                      <Text $secondary>{userData.fullName}</Text>
                      <Text $secondary>{userData.email}</Text>
                  </Info>
                  </ProfileCard>
                  <BlueButton onClick={updateHostInformation}>Update</BlueButton>
              </ProfileCardWrapper>

              {/* Editable Info Card */}
              <Card>
              <EditableDetails>
                  <Input
                      type={"text"}
                      name={'phoneNumber'}
                      label={'Phone Number'}
                      data={userData}
                      setData={setUserData}
                      placeholder={'Enter phone number'}
                      role="host"
                      />
                      <Input
                      type={"url"}
                      name={'companyWebsite'}
                      label={'Company Website'}
                      data={userData}
                      setData={setUserData}
                      role="host"
                      placeholder={'Enter url'}
                      />
                      <Input
                      type={"text"}
                      name={'companyIndustry'}
                      label={'Company Industry'}
                      data={userData}
                      setData={setUserData}
                      placeholder={'Enter company industry'}
                      role="host"
                      />
              </EditableDetails>
              </Card>
          </CardsWrapper>
          </Container>
        </Section>
    );
}