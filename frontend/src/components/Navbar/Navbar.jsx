import styled from "styled-components";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { media } from "../../Pages/LandingPage/LandingPage";

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

const LogoContainer = styled.div`
  display: flex;
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

export default function NavBar({ mode, toggleSidebar }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const onLoginButtonClick = () => {
    navigate('/login', {replace: true});
  }

  const onSignUpButtonClick = () => {
    navigate('/signup', {replace: true});
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const renderNavbarContent = () => {
    switch(mode){
      case 'guest': 
            return (
              <>
                <LogoContainer>
                  <p>Logo</p>
                </LogoContainer>
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

      case "user": 
            return(
              <>
                <BurgerMenuIcon onClick={toggleSidebar}>☰</BurgerMenuIcon>
                <LogoContainer style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <p>Logo</p>
                </LogoContainer>
              </>
            );
      default: 
            return (
              <>
                <LogoContainer>
                  <p>Logo</p>
                </LogoContainer>
              </>
            );
    }
  };

  return (
    <NavbarContainer>
      {renderNavbarContent()}
    </NavbarContainer>
  );
}