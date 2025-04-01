import { Card, CardsWrapper, PageTitle, ProfileCard, ProfileCardWrapper, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import Input from '../../../components/Input/Input';
import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { useState } from "react";
import Popup from "../../../components/Popup/Popup";

const Container = styled.div`
  max-width: 100%;
  margin: 40px auto;
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

const UpdateButton = styled.button`
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
    const [userData, setUserData] = useState({
      fullName: "Maysam Matar",
      companyName: "Eventure",
      email: "eventure@hotmail.com",
      phoneNumber: "3747483949",
      companyWebsite: null,
      companyIndustry: null,
      businessRegistrationProof: null,
    });
    
    const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

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
                  <UpdateButton>Update</UpdateButton>
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