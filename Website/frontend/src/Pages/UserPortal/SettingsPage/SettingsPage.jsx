import profile from '../../../assets/profile.png'
import styled from "styled-components";
import { useEffect, useState } from "react";
import Input from '../../../components/Input/Input';
import useUserState from '../../../hooks/use-user-state';
import Popup from '../../../components/Popup/Popup';
import useSendRequest from '../../../hooks/use-send-request';
import ImageInput from '../../../components/ImageInput/ImageInput';
import { uploadImage } from '../../../Supabase/uploadImage';

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
width: 100%;
`;

export default function SettingsPage() {
  const { user, setUser } = useUserState();
  const [sendRequest] = useSendRequest();
  const [imageFile, setImageFile] = useState(null);

  const [userData, setUserData] = useState({
    //profilePic: user.profilePic || profile,
    dateOfBirth: user.dateOfBirth || null,
    //phone: user.phone || "",
    location: user.country || null,
    educationLevel: user.educationLevel || null,
    fieldOfStudy: user.fieldOfStudy || null,
    preferredEventType: user.preferredEventType || null,
    yearsOfExperience: user.yearsOfExperience || null,
    linkedin: user.linkedin || null,
    github: user.github || null,
  });

  useEffect(() => {
    console.log(user)
    if(user.isPartner === 1){
      getPartnerDetails();
    }
  },[])

  const [partnerData, setPartnerData] = useState({
    companyName: null,
    companyLogo: null,
    primaryContactFullName: null,
    primaryContactEmail: null,
    companyIndustry: null,
    companyWebsite: null,
    primaryContactJobTitle: null,
    primaryContactPhoneNumber: null,
    companyDescription: null,
  });

  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});

  async function onUpdateClick(e){
    e.preventDefault();
    try {
      let imageUrl = "";
      let payload = {
          ...partnerData,
      };


      //if (!imageFile) {
        imageUrl = await uploadImage(imageFile);
        console.log(imageUrl)

        payload = {
          ...partnerData,
          companyLogo: imageUrl,
        };

        setPartnerData(payload)
      //}
      
      console.log("Final payload for DB:", payload);
      updatePartnerInformation(payload)
      // submit payload to backend/db
      
    } catch (err) {
            setPopup({message:`Image upload failed: ${err.message}`, type: 'fail', isVisible: true});
    }
  }

  async function updateUserInformation (){
    
    // if(!userData.phoneNumber){
    //   setPopup({message: 'Phone Number is required', type: 'fail', isVisible: true});
    //   return;
    // }

    let URL = '/api/users/update';

    const body = Object.fromEntries(
      Object.entries(userData).filter(([key, value]) => (value != null && value != "") && key!='id')
    );

    console.log(body)
    let INIT = {method: 'PUT', body: JSON.stringify(body)}

    let {request, response} = await sendRequest(URL, INIT);
    console.log(response)

    if(response?.success){
      //console.log({...response.data, role: 'user'}, response)
      // const newUserInfo = {...response.data, role: 'user'};
      // setUser(newUserInfo)
      // localStorage.setItem("user", JSON.stringify({...newUserInfo, role: 'user'}));

      setUser(prev => {
        const updatedUser = {
          ...prev,
          ...response.data,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log(updatedUser)
        return updatedUser;
      });

      setPopup({message: 'Info updated!', type: 'success', isVisible: true});
    }else{
      setPopup({message: 'Failed to update! Try again', type: 'fail', isVisible: true});
      return;
    }
  }

  async function updatePartnerInformation(payload){
    const partnerId = user.partnerId;

    const body = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => value !== null && key !='userId' && key!='id')
    );

    console.log(body)

    const URL = `/api/partner/update/${partnerId}`;
    const INIT = {method: 'PUT', body: JSON.stringify(body)};

    console.log(partnerData)

    const {response} = await sendRequest(URL, INIT);
    console.log(response)

    if(response?.success === true){
      setPopup({message: 'Info updated successfully!', isVisible: true, type: 'success'});
      getPartnerDetails();
    }else if(response?.success === false && response.error[0].code === 'VALIDATION_ERROR'){
      setPopup({message: response.error[0].message, isVisible: true, type: 'fail'});  
    }else{
      setPopup({message: 'Coudnt update partner data!', isVisible: true, type: 'fail'});  
    }

  }

  async function getPartnerDetails(){
    const partnerId = user.partnerId;

    const URL = `/api/partner/${partnerId}`;
    const {response} = await sendRequest(URL);
    console.log(response)

    if(response?.success === true){
      const partnerDetails = response.data;

      setPartnerData(partnerDetails);
    }else{
      setPopup({message: 'Coudnt load partner data!', isVisible: true, type: 'fail'});  
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
            {user.isPartner === 0 && <UpdateButton onClick={updateUserInformation}>Update</UpdateButton>}
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
              {user.isPartner === 1 && <UpdateButton onClick={updateUserInformation}>Update</UpdateButton>}
            </EditableDetails>
          </Card>

          {user.isPartner === 1 && (
            <Card>
              <EditableDetails>
                <Input label={'Company Name*'} 
                      type='text' 
                      name={'companyName'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`Enter company name`}
                />

                {/* <Input label={'Company Logo*'} 
                      type='text' 
                      name={'companyLogo'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                /> */}
                <ImageInput 
                  label="Company Logo*"
                  name={'companyLogo'}
                  required={true}
                  setFile={setImageFile}/>

                {partnerData.companyLogo &&
                 (<div style={{display: 'flex', gap: '10px'}}>
                  <div style={{fontSize: '12px'}}>Current Logo: </div>
                  <img src={partnerData.companyLogo} 
                    alt='Preview img' 
                    style={{height: '50px', width: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px'}}/>
                </div>)}

                <Input label={'Company Industry'} 
                      type='text' 
                      name={'companyIndustry'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`enter industry`}
                />

                <Input label={'Company Website*'} 
                      type='url' 
                      name={'companyWebsite'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`compay.com`}
                />

                <Input label={'Company description'} 
                      type='textarea' 
                      name={'companyDescription'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`description...`}
                />

                <Input label={'Primary Contact Full Name*'} 
                      type='text' 
                      name={'primaryContactFullName'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`Enter name`}
                />

                <Input label={'Primary Contact Email*'} 
                      type='email' 
                      name={'primaryContactEmail'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`name@company.com`}
                />

                <Input label={'Primary Contact Job Title'} 
                      type='email' 
                      name={'primaryContactJobTitle'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`ex. manager`}
                />

                <Input label={'Primary Contact Phone Nb'} 
                      type='text' 
                      name={'primaryContactPhoneNumber'} 
                      data={partnerData} 
                      setData={setPartnerData} 
                      placeholder={`ex. 09288299`}
                />

                <UpdateButton onClick={onUpdateClick}>Update</UpdateButton>
              </EditableDetails>
            </Card>
          )}
        </CardsWrapper>
      </Container>
    </Section>
  );
}
