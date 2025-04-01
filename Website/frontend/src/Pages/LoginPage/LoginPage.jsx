import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import { Link, replace, useNavigate } from "react-router-dom";
import useSendRequest from "../../hooks/use-send-request";
import useUserState from "../../hooks/use-user-state";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { OrangeShape, OverlayShape, RoleButton, RoleContainer } from "../SignUpPage/SignUpPage";
import { BackButton } from "../EventDetailsPage/EventDetailsPage";
import { FaArrowLeft } from "react-icons/fa";

const Section = styled.section`
  background-color: var(--background-three);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
`;

const Container = styled.div`
  background-color: var(--text-background);
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-second);
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary || "#6b7280"};
`;

const Button = styled.button`
  width: 100%;
  background-color: var(--general-bg-base);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: var(--general-bg-base-hover);
  }
`;

const Footer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary || "#6b7280"};
`;

const SignUpLink = styled(Link)`
  color: var(--general-bg-base);
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginPage(){
    //const [showPassword, setShowPassword] = useState(false);
    const [sendRequest] = useSendRequest();
    const {user, setUser} = useUserState();
    const navigate = useNavigate();

    const [loginForm, setLoginForm] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const [selectedRole, setSelectedRole] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    async function onLoginClick(){
      setErrorMsg(null);
      if(loginForm.usernameOrEmail === '' || loginForm.password === ''){
        setErrorMsg("Fields must not be empty");
        return;
      }

      if(selectedRole === 'user'){
        let URL = '/api/auth/user/login';
        let INIT = {method: 'POST', body: JSON.stringify(loginForm)}
  
        let {request, response} = await sendRequest(URL, INIT);
        if(response?.success === false){
          setErrorMsg(response.error[0]?.message);
          return;
        }else if(response?.success === true){
          const user = response?.data[0]?.user;
          console.log({...user, role: 'user'})
          setUser({...user, role: 'user'})
          localStorage.setItem("user", JSON.stringify({...user, role: 'user'}));
        }

      }else if(selectedRole === 'host'){
        let URL = '/api/auth/host/login';
        let INIT = {method: 'POST', body: JSON.stringify({email: loginForm.usernameOrEmail, password: loginForm.password})}

        let {request, response} = await sendRequest(URL, INIT);

        if(response?.success === false){
          setErrorMsg(response.error[0]?.message);
          return;
        }else if(response?.success === true){
          const host = response?.data[0]?.host;
          setUser({...host, role: 'host'})
          localStorage.setItem("user", JSON.stringify({...host, role: 'host'}));
        }
      }

      //console.log(response?.error[0].message)

      //navigate('/', {replace: true});
      window.location.href = '/';
      console.log(request, response)

      // if(response.user.role.name == 'user'){
      //   navigate('/user', {replace: true});
      // }else if(response.user.role.name == 'host'){
      //   navigate('/host', {replace: true});
      // }
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
        <Section>
          <OverlayShape/>
          <OrangeShape/>
          <OverlayShape />
          <BackButton onClick={() => navigate("/", {replace: true})}>
            <FaArrowLeft />
             Back
          </BackButton>
          <Container>
            <Title>Login to your account</Title>
            <Form>
              <Input label={"Email or username"} type="text" name={"usernameOrEmail"} data={loginForm} setData={setLoginForm} placeholder={"name@company.com or yourusername..."} reqiured={true}/>
              <Input label={"Password"} type="password" name={"password"} data={loginForm} setData={setLoginForm} placeholder={"••••••••"} reqiured={true}/>
              {/* <CheckboxContainer>
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <Link href="#">Forgot password?</Link>
              </CheckboxContainer> */}
              <ErrorMessage message={errorMsg}/>
              <Button onClick={onLoginClick}>Login</Button>
            </Form>
            <Footer>
              Don’t have an account yet? <SignUpLink to="/signup">Sign up</SignUpLink>
            </Footer>
          </Container>
        </Section>
      );
}