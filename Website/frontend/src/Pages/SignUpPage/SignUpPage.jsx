import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { Button1, Button2 } from "../../components/Navbar/Navbar";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import useSendRequest from "../../hooks/use-send-request";
import Popup from "../../components/Popup/Popup";
import { FaArrowLeft } from "react-icons/fa";
import { BackButton } from "../EventDetailsPage/EventDetailsPage";
import useUserState from "../../hooks/use-user-state";

const float = keyframes`
  0% { transform: translateY(0px) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(-5deg); }
`;

const Section = styled.section`
  background-color: var(--background-three);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  position: relative;
  width: 100%;
`;

export const OrangeShape = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  background: linear-gradient(45deg, var(--general-bg-base), var(--general-bg-base));
  clip-path: polygon(50% 0%, 100% 25%, 80% 90%, 20% 100%, 0% 75%);
  animation: ${float} 8s ease-in-out infinite;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
`;

export const OverlayShape = styled.div`
  position: fixed;
  width: 800px;
  height: 800px;
  background: rgba(241, 134, 80, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 80% 90%, 20% 100%, 0% 75%);
  opacity: 0.8;
  pointer-events: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const RoleContainer = styled.div`
  background: var(--text-background);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 0 30px rgba(241, 134, 80, 0.3);
  position: relative;
  z-index: 1001;
`;

export const RoleButton = styled.button`
  background: ${props => props.active ? 'var(--general-bg-base)' : 'transparent'};
  border: 1px solid var(--general-bg-light);
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  padding: 1.5rem 3rem;
  margin: 1rem;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border: 1px solid var(--general-bg-base);
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
  }
`;

const SignUpContainer = styled.div`
  background: var(--text-background);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  position: relative;
  z-index: 1;
  margin: 2rem;
`;

const GridForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const FormHeader = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: var(--general-bg-base);
    margin: 0.5rem auto;
  }
`;

const AgreementLabel = styled.label`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 1rem 0;
  color: var(--text-second);
  
  a {
    color: var(--general-bg-base);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignUpPage() {
  const {setUser} = useUserState();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    dateOfBirth: '',
    profilePic: null,
    educationLevel: '',
    country: '',
    preferredEventType: '',
    fieldOfStudy: '',
  });
  const [hostData, setHostData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    phoneNumber: '',
    website: '',
    industry: '',
    registrationProof: null,
    termsAgreement: false,
    privacyAgreement: false
  })

  const [error, setError] = useState("");
  const [sendRequest] = useSendRequest();
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.files[0]});
  };

  async function createAccount(){
    if(selectedRole === 'user'){
      if(!formData.fullName || !formData.username || !formData.email || !formData.password){
        setError("Missing required fields");
        return;
      }
      let URL = '/api/auth/user/register';
      let INIT = {method: 'POST', body: JSON.stringify(formData)}

      const {request, response} = await sendRequest(URL, INIT);
      console.log(request, response)

      if(response?.success === true){
        setPopup({message: 'Account created successfully', type: 'success', isVisible: true});
        setError("")
        return;
        //navigate('/login');
        // setUser({...response.data[0], role: 'user'})
        // localStorage.setItem("user", JSON.stringify({...response.data[0], role: 'user'}));
        // window.location.href = '/user';

      }else if(response?.success === false){
        setError(response.error[0]?.message);
        return;
      }


    }else if(selectedRole === 'host'){
      if(!hostData.email || !hostData.fullName || !hostData.companyName || !hostData.password){
        setError("Missing required fields");
        return;
      }

      let URL = '/api/auth/host/register';
      let INIT = {method: 'POST', body: JSON.stringify(hostData)}

      const {request, response} = await sendRequest(URL, INIT);

      console.log(hostData, response)

      if(response?.success === true){
        setPopup({message: 'Account created successfully', type: 'success', isVisible: true});
        setError("")
        //navigate('/login');
        // setUser({...response.data[0], role: 'host'})
        // localStorage.setItem("user", JSON.stringify({...response.data[0], role: 'host'}));
        // window.location.href = '/host';
        return;

      }else if(response?.success === false){
        setError(response.error[0]?.message);
        return;
      }
    }
  }

  if (!selectedRole) {
    return (
      <Section>
        <OrangeShape />
        <OverlayShape />
        <BackButton onClick={() => navigate("/", {replace: true})}>
          <FaArrowLeft />
            Back
        </BackButton>
          <RoleContainer>
            <h2 style={{color: 'var(--text-primary)', marginBottom: '2rem'}}>
              Choose Your Role
            </h2>
            <div style={{display: 'flex', gap: '1rem'}}>
              <RoleButton onClick={() => setSelectedRole('user')}>
                🎮 Join as User
              </RoleButton>
              <RoleButton onClick={() => setSelectedRole('host')}>
                🏢 Join as Host
              </RoleButton>
            </div>
          </RoleContainer>
      </Section>
    );
  }

  return (
    <>
    <Popup popUpSettings={popup}/>
    <Section>
      <OverlayShape />
      <OrangeShape/>
      <OverlayShape />
        <BackButton onClick={() => navigate("/", {replace: true})}>
          <FaArrowLeft />
            Back
        </BackButton>
      <SignUpContainer>
        <FormHeader>
          {selectedRole === 'user' ? 'User Sign Up' : 'Host Sign Up'}
        </FormHeader>
        
        <GridForm>
          {selectedRole === 'user' ? (
            <>
              <Input label="Username*" name="username" data={formData} setData={setFormData} placeholder={'Enter username'} required={true}/>
              <Input label="Full Name*" name="fullName" data={formData} setData={setFormData} placeholder={'Enter full name'} required={true}/>
              <Input label="Email*" type="email" name="email" data={formData} setData={setFormData} placeholder={'Enter email'} required={true}/>
              <Input label="Password*" type="text" name="password" data={formData} setData={setFormData} placeholder={'Enter Password'} required={true}/>
              <Input label="Date of Birth*" type="date" name="dateOfBirth" data={formData} setData={setFormData}/>
              {/* <Input label="Profile Picture" type="file" name="profilePic" onChange={handleFileChange} /> */}
              <Input label="Education Level" name="educationLevel" data={formData} setData={setFormData} placeholder={'Enter education level'}/>
              <Input label="Country" name="country" data={formData} setData={setFormData} placeholder={'Enter country'}/>
              <Input label="Preferred Event Type" name="preferredEventType" data={formData} setData={setFormData} placeholder={'Enter preferences'}/>
              <Input label="Field of Study" name="fieldOfStudy" data={formData} setData={setFormData} placeholder={'Enter field of study'}/>
            </>
          ) : (
            <>
              <Input label="Full Name*" name="fullName" data={hostData} setData={setHostData} required={true} placeholder={'Enter full name'}/>
              <Input label="Company Name*" name="companyName" data={hostData} setData={setHostData} required={true} placeholder={'Enter company name'}/>
              <Input label="Email*" type="email" name="email" data={hostData} setData={setHostData} required={true} placeholder={'Enter email'}/>
              <Input label="Password*" type="password" name="password" data={hostData} setData={setHostData} placeholder={'Enter Password'} required={true}/>
              <Input label="Phone Number*" type="tel" name="phoneNumber" data={hostData} setData={setHostData} placeholder={'Enter Phone nb'}/>
              <Input label="Company Website" type="url" name="website" data={hostData} setData={setHostData} placeholder={'Enter url'}/>
              <Input label="Industry" name="industry" data={hostData} setData={setHostData} placeholder={'Enter company industry'}/>
              {/* <Input label="Business Registration Proof" type="file" name="registrationProof" onChange={handleFileChange} required={true}/> */}
              
              <div style={{gridColumn: '1 / -1'}}>
                <AgreementLabel>
                  <input 
                    type="checkbox" 
                    checked={hostData.agreedTerms}
                    onChange={(e) => setHostData((prev) => ({...prev, termsAgreement: e.target.checked}))}
                  />
                  I agree to the <Link to="/terms">Terms of Service</Link>
                </AgreementLabel>
                <AgreementLabel>
                  <input 
                    type="checkbox" 
                    checked={hostData.agreedPrivacy}
                    onChange={(e) => setHostData((prev) => ({...prev, privacyAgreement: e.target.checked}))}
                  />
                  I agree to the <Link to="/privacy">Privacy Policy</Link>
                </AgreementLabel>
              </div>
            </>
          )}
        
        </GridForm>
        <ErrorMessage message={error}/>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
            <Button1 onClick={createAccount}>
              Create Account
            </Button1>
          </div>
      </SignUpContainer>
    </Section>
    </>
  );
}
