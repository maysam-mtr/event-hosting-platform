import { Card, CardsWrapper, PageTitle, ProfileCard, ProfileCardWrapper, Section } from "../../UserPortal/SettingsPage/SettingsPage";
import Input from '../../../components/Input/Input';
import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { useState } from "react";

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
            name: "John Doe",
            email: "johndoe@example.com",
            username: "johndoe123",
            birthdate: "2000-01-01",
            phone: "123-456-7890",
            location: "New York, USA",
            role: "partner", // Change to "user" to hide Partner Card
            company: "Tech Corp",
            position: "Lead Developer",
          });
    

      return (
        <Section>
        <PageTitle>Settings</PageTitle>
        <Container>
        <CardsWrapper>
            {/* Profile Card (Static Info) */}
            <ProfileCardWrapper>
                <ProfileCard>
                <ProfilePic src={profile} alt="Profile" />
                <Info>
                    <Text $bold>{userData.name}</Text>
                    <Text $secondary>{userData.email}</Text>
                    <Text $secondary>@{userData.username}</Text>
                </Info>
                </ProfileCard>
                <UpdateButton>Update</UpdateButton>
            </ProfileCardWrapper>

            {/* Editable Info Card */}
            <Card>
            <EditableDetails>
                {["birthdate", "phone", "location"].map((field) => (
                <div key={field}>
                    <Input
                    type={field === "birthdate" ? "date" : "text"}
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    data={userData}
                    setData={setUserData}
                    />
                </div>
                ))}
            </EditableDetails>
            </Card>
        </CardsWrapper>
        </Container>
        </Section>
    );
}