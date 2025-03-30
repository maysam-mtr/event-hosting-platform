import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import { Button1 } from "../../components/Navbar/Navbar";

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
`;

const OrangeShape = styled.div`
  position: fixed;
  width: 600px;
  height: 600px;
  background: linear-gradient(45deg, var(--general-bg-base), var(--general-bg-light));
  clip-path: polygon(50% 0%, 100% 25%, 80% 90%, 20% 100%, 0% 75%);
  animation: ${float} 8s ease-in-out infinite;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
`;

const OverlayShape = styled.div`
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

const RoleContainer = styled.div`
  background: var(--text-background);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 0 30px rgba(241, 134, 80, 0.3);
  position: relative;
  z-index: 1001;
`;

const RoleButton = styled.button`
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
  max-width: 800px;
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
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    // User specific
    username: '',
    dob: '',
    profilePic: null,
    educationLevel: '',
    country: '',
    eventType: '',
    fieldOfStudy: '',
    // Host specific
    companyName: '',
    phone: '',
    website: '',
    industry: '',
    registrationProof: null,
    agreedTerms: false,
    agreedPrivacy: false
  });

  const handleFileChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.files[0]});
  };

  if (!selectedRole) {
    return (
      <Section>
        <OrangeShape />
        <OverlayShape />
        {/* <ModalOverlay> */}
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
        {/* </ModalOverlay> */}
      </Section>
    );
  }

  return (
    <Section>
      <OverlayShape />
      <SignUpContainer>
        <FormHeader>
          {selectedRole === 'user' ? 'User Sign Up' : 'Host Registration'}
        </FormHeader>
        
        <GridForm>
          {selectedRole === 'user' ? (
            <>
              <Input label="Username" name="username" data={formData} setData={setFormData} />
              <Input label="Full Name" name="fullName" data={formData} setData={setFormData} />
              <Input label="Email" type="email" name="email" data={formData} setData={setFormData} />
              <Input label="Date of Birth" type="date" name="dob" data={formData} setData={setFormData} />
              <Input label="Profile Picture" type="file" name="profilePic" onChange={handleFileChange} />
              <Input label="Education Level" name="educationLevel" data={formData} setData={setFormData} />
              <Input label="Country" name="country" data={formData} setData={setFormData} />
              <Input label="Preferred Event Type" name="eventType" data={formData} setData={setFormData} />
              <Input label="Field of Study" name="fieldOfStudy" data={formData} setData={setFormData} />
            </>
          ) : (
            <>
              <Input label="Full Name" name="fullName" data={formData} setData={setFormData} />
              <Input label="Company Name" name="companyName" data={formData} setData={setFormData} />
              <Input label="Email" type="email" name="email" data={formData} setData={setFormData} />
              <Input label="Phone Number" type="tel" name="phone" data={formData} setData={setFormData} />
              <Input label="Company Website" type="url" name="website" data={formData} setData={setFormData} />
              <Input label="Industry" name="industry" data={formData} setData={setFormData} />
              <Input label="Business Registration Proof" type="file" name="registrationProof" onChange={handleFileChange} />
              
              <div style={{gridColumn: '1 / -1'}}>
                <AgreementLabel>
                  <input 
                    type="checkbox" 
                    checked={formData.agreedTerms}
                    onChange={(e) => setFormData({...formData, agreedTerms: e.target.checked})}
                  />
                  I agree to the <Link to="/terms">Terms of Service</Link>
                </AgreementLabel>
                <AgreementLabel>
                  <input 
                    type="checkbox" 
                    checked={formData.agreedPrivacy}
                    onChange={(e) => setFormData({...formData, agreedPrivacy: e.target.checked})}
                  />
                  I agree to the <Link to="/privacy">Privacy Policy</Link>
                </AgreementLabel>
              </div>
            </>
          )}
          
          <div style={{gridColumn: '1 / -1'}}>
            <Button1 style={{marginTop: '1rem'}}>
              {selectedRole === 'user' ? 'Create Account' : 'Register Host Account'}
            </Button1>
          </div>
        </GridForm>
      </SignUpContainer>
    </Section>
  );
}
