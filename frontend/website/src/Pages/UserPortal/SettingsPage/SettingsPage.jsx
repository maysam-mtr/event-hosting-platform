import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { use, useState } from "react";
import Input from '../../../components/Input/Input';

const Container = styled.div`
  max-width: 100%;
  margin: 40px auto;
  padding: 20px;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const ProfileCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 0.5; /* Keeps it smaller */

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ProfileCard = styled(Card)`
  display: flex;
  align-items: center;
  min-height: 120px;

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
  color: ${({ secondary }) => (secondary ? "gray" : "black")};
  font-weight: ${({ bold }) => (bold ? "bold" : "normal")};
`;

const EditableDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// const Label = styled.p`
//   font-weight: bold;
//   color: #555;
// `;

// const Input = styled.input`
//   background: #f8f8f8;
//   padding: 10px;
//   border-radius: 5px;
//   border: 1px solid #ddd;
//   width: 100%;
// `;

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

const PageTitle = styled.div`
border-bottom: 2px solid #ddd;
color: var(--text-primary);
font-size: var(--heading-2);
font-weight: 600;
padding: 10px 0;
`;

const Section = styled.div`
padding: 30px;
`;

export default function SettingsPage() {
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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

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
                <Text bold>{userData.name}</Text>
                <Text secondary>{userData.email}</Text>
                <Text secondary>@{userData.username}</Text>
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

        {/* Partner Card (Only if role === "partner") */}
        {userData.role === "partner" && (
          <Card>
            <EditableDetails>
              {["company", "position"].map((field) => (
                <div key={field}>
                  <Input
                    type="text"
                    name={field}
                    data={userData}
                    setData={setUserData}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
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
