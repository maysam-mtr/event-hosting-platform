import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import { Link, replace, useNavigate } from "react-router-dom";
import useSendRequest from "../../hooks/use-send-request";
import useUserState from "../../hooks/use-user-state";

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
  gap: 2rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-second);
`;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.625rem;
//   border: 1px solid var(--border-color);
//   border-radius: 6px;
//   background-color: var(--background-three);
//   color:var(--text-primary);
// `;

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
        username: '',
        password: ''
    });

    async function onLoginClick(){
      const URL = '/api/login';
      //...

      const response = {
        user: {
          id: 1,
          profile_picture: null,//defaultPicture, 
          name: "Maysam Matar",
          email: "maysam@hotmail.com",
          role: {
              name: "user",
              id: 1,
          },
        }
      }

      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user));
      if(response.user.role.name == 'user'){
        navigate('/user', {replace: true});
      }else if(response.user.role.name == 'host'){
        navigate('/host', {replace: true});
      }
    }

    return (
        <Section>
          <Container>
            <Title>Login to your account</Title>
            <Form>
              <Input label={"Your email"} type="email" name={"email"} data={loginForm} setData={setLoginForm} placeholder={"name@company.com"} reqiured/>
              <Input label={"Password"} type="password" name={"password"} data={loginForm} setData={setLoginForm} placeholder={"••••••••"} reqiured/>
              {/* <CheckboxContainer>
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <Link href="#">Forgot password?</Link>
              </CheckboxContainer> */}
              <Button onClick={onLoginClick}>Login</Button>
            </Form>
            <Footer>
              Don’t have an account yet? <SignUpLink to="/signup">Sign up</SignUpLink>
            </Footer>
          </Container>
        </Section>
      );
}