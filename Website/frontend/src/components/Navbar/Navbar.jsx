import styled from "styled-components";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { media } from "../../Pages/LandingPage/LandingPage";
import logo from '../../assets/logo1.png';
import logoHost from '../../assets/logoHost.png';
import Popup from "../Popup/Popup";
import useSendRequest from "../../hooks/use-send-request";

const NavbarContainer = styled.div`
  width: 100%;
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--background-main);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  width: 100%;

  @media (${media.tablet}) {
    justify-content: flex-end;
  }
`;

const PagesContainer = styled.div`
  display: flex;
  gap: 2.5rem;

  @media (${media.tablet}) {
    display: none;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Button1 = styled.button`
  background-color: var(--general-bg-base);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--heading-6);
  border: 0;
  border: 1px solid var(--general-bg-dark);
  border-bottom: 3px solid var(--general-bg-dark);
  height: fit-content;
  width: fit-content;
  color: var(--text-background);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  cursor: pointer;

  &:hover {
    border: 1px solid var(--general-bg-base-hover);
    background-color: var(--general-bg-base-hover);
    border-bottom: 3px solid var(--general-bg-base-hover);
  }
`;

export const Button2 = styled.button`
  background-color: var(--background-main);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--heading-6);
  font-weight: 500;
  border: 0;
  border: 1px solid var(--general-bg-base);
  border-bottom: 3px solid var(--general-bg-base);
  height: fit-content;
  width: fit-content;
  color: var(--general-bg-base);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: var(--general-bg-base-hover);
    color: var(--text-background);
  }
`;

export const Button3 = styled.button`
  background-color: var(--host-bg-base);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--heading-6);
  border: 0;
  border: 1px solid var(--host-bg-dark);
  border-bottom: 3px solid var(--host-bg-dark);
  height: fit-content;
  width: fit-content;
  color: var(--text-background);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  cursor: pointer;

  &:hover {
    border: 1px solid var(--host-bg-base-hover);
    background-color: var(--host-bg-base-hover);
    border-bottom: 3px solid var(--host-bg-base-hover);
  }
`;

const LogoContainer = styled.img`
  max-height: 100px;
  max-width: 200px;
  padding: 20px;
`;

const MenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (${media.tablet}) {
    display: block;
  }
`;

const BurgerMenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover{
  color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-base)' : "var(--general-bg-base)"};
  }
`;

const Tab = styled(Link)`
color: ${({ $active }) => $active ? "var(--general-bg-base)" : 'var(--text-primary)'};
border: 0;
background-color: transparent;
font-size: var(--heading-6);
cursor: pointer;
text-decoration: none;
transition: color 0.3s ease-in-out;

&:hover{
color: var(--general-bg-light);
}

`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  justify-content: space-between;
`;

export default function NavBar({ role, toggleSidebar }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [popup, setPopup] = useState({message: 'message', type: 'success', isVisible: false});
  const [sendRequest] = useSendRequest();

  const navigate = useNavigate();

  const onLoginButtonClick = () => {
    navigate('/login', {replace: true});
  }

  const onSignUpButtonClick = () => {
    navigate('/signup', {replace: true});
  }

  async function onLogoutClick(){

    let URL = role === 'user' ? '/api/auth/user/logout': '/api/auth/host/logout';
    let INIT = {method: 'POST', body: ''}

    let {request, response} = await sendRequest(URL, INIT);
    console.log(request, response)

    if(response.success){
      localStorage.removeItem("user");
      // navigate('/', {replace: true});
      window.location.href = "/"; 
    }else{
      setPopup({message: 'Failed to logout!', type: 'fail', isVisible: true})
    }
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const renderNavbarContent = () => {
    switch(role){
      case 'guest': 
            return (
              <>
                <LogoContainer
                  src={logo}
                  alt="logo"/>
                  
                <ButtonsWrapper>
                  {/* Page Links */}
                  <PagesContainer>
                  <Tab to="/index" $active={location.pathname === "/index"}>Home</Tab>
                  <Tab to="/index/pricing" $active={location.pathname === "/index/pricing"}>Pricing</Tab>
                  <Tab to="/index/contact_us" $active={location.pathname === "/index/contact_us"}>Contact Us</Tab>
                  </PagesContainer>

                  {/* Auth Buttons */}
                  <ButtonsContainer>
                    <Button2 onClick={onLoginButtonClick}>Log in</Button2>
                    <Button1 onClick={onSignUpButtonClick}>Sign up</Button1>
                  </ButtonsContainer>

                  {/* Menu Icon for Mobile */}
                  <MenuIcon onClick={toggleMenu}>☰</MenuIcon>
                </ButtonsWrapper>
              </>
            );
      case "host":
        return(
          <NavbarContent>
            <BurgerMenuIcon $role={role} onClick={toggleSidebar} >☰</BurgerMenuIcon>
            <LogoContainer
              src={logoHost}
              alt="logo"
            />
            <Button3 style={{right: '20px'}} onClick={onLogoutClick}>Logout</Button3>
          </NavbarContent>
        );
      case "user": 
            return(
              <NavbarContent>
                <BurgerMenuIcon $role={role} onClick={toggleSidebar} >☰</BurgerMenuIcon>
                <LogoContainer
                  src={logo}
                  alt="logo"
                />
                <Button1 style={{right: '20px'}} onClick={onLogoutClick}>Logout</Button1>
              </NavbarContent>
            );
      default: 
            return (
              <>
                <LogoContainer
                  src={logo}
                  alt="logo"/>
              </>
            );
    }
  };

  return (
    <>
    <Popup popUpSettings={popup}/>
    <NavbarContainer>
      {renderNavbarContent()}
    </NavbarContainer>
    </>
  );
}