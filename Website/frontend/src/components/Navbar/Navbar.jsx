/**
 * Navbar Component
 *
 * The main navigation bar component that appears at the top of the application.
 * Provides navigation links, user authentication status, and role-based menu items.
 *
 * Key Features:
 * - Responsive design with mobile hamburger menu
 * - Role-based navigation (Guest, Host, User)
 * - Authentication state management
 * - Logo display with role-specific branding
 * - Mobile-first responsive navigation
 * - Logout functionality with API integration
 *
 * Props:
 * - role: 'guest', 'host', or 'user' for role-specific navigation
 * - toggleSidebar: function to control sidebar visibility
 *
 * Navigation includes:
 * - Home/Dashboard links
 * - Pricing and contact pages (for guests)
 * - Authentication buttons (login/logout)
 * - Sidebar toggle for authenticated users
 *
 * Integrates with user authentication system and provides
 * seamless navigation experience across all user roles
 */

import styled from "styled-components"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../../assets/logo1.png"
import logoHost from "../../assets/logoHost.png"
import Popup from "../Popup/Popup"
import useSendRequest from "../../hooks/use-send-request"

// Styled Components
const NavbarContainer = styled.div`
  width: 100%;
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 300;
  background-color: var(--background-main);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$open ? "flex" : "none")};
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--background-main);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    padding: 1rem 2rem;
    gap: 1.5rem;
    z-index: 299;
  }
`

const PagesContainer = styled.div`
  display: flex;
  gap: 2.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`

const LogoContainer = styled.img`
  max-height: 100px;
  max-width: 200px;
  padding: 20px;
`

const MenuIcon = styled.div`
  font-size: 26px;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const Tab = styled(Link)`
  color: ${({ $active }) => ($active ? "var(--general-bg-base)" : "var(--text-primary)")};
  background-color: transparent;
  font-size: var(--heading-6);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: var(--general-bg-light);
  }
`

export const Button1 = styled.button`
  background-color: var(--general-bg-base);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--heading-6);
  border: 1px solid var(--general-bg-dark);
  border-bottom: 3px solid var(--general-bg-dark);
  color: var(--text-background);
  cursor: pointer;

  &:hover {
    background-color: var(--general-bg-base-hover);
    border-color: var(--general-bg-base-hover);
  }
`

export const Button2 = styled.button`
  background-color: var(--background-main);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--heading-6);
  border: 1px solid var(--general-bg-base);
  border-bottom: 3px solid var(--general-bg-base);
  color: var(--general-bg-base);
  cursor: pointer;

  &:hover {
    background-color: var(--general-bg-base-hover);
    color: var(--text-background);
  }
`

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
  }`

export default function NavBar({ role, toggleSidebar }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [popup, setPopup] = useState({ message: "message", type: "success", isVisible: false })
  const [sendRequest] = useSendRequest()
  const navigate = useNavigate()

  const onLoginButtonClick = () => navigate("/login")
  const onSignUpButtonClick = () => navigate("/signup")

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  const onLogoutClick = async () => {
    const URL = role === "user" ? "/api/auth/user/logout" : "/api/auth/host/logout"
    const INIT = { method: "POST", body: "" }

    const { response } = await sendRequest(URL, INIT)

    if (response.success) {
      localStorage.removeItem("user")
      window.location.href = "/"
    } else {
      setPopup({ message: "Failed to logout!", type: "fail", isVisible: true })
    }
  }

  const GuestNav = (
    <>
      <LogoContainer src={logo} alt="logo" />

      <ButtonsWrapper>
        <PagesContainer>
          <Tab to="/index" $active={location.pathname === "/index"}>
            Home
          </Tab>
          <Tab to="/index/pricing" $active={location.pathname === "/index/pricing"}>
            Pricing
          </Tab>
          <Tab to="/index/contact_us" $active={location.pathname === "/index/contact_us"}>
            Contact
          </Tab>
        </PagesContainer>

        <ButtonsContainer>
          <Button2 onClick={onLoginButtonClick}>Log in</Button2>
          <Button1 onClick={onSignUpButtonClick}>Sign up</Button1>
        </ButtonsContainer>

        <MenuIcon onClick={toggleMenu}>☰</MenuIcon>
      </ButtonsWrapper>

      <MobileMenu $open={menuOpen}>
        <Tab to="/index" onClick={toggleMenu}>
          Home
        </Tab>
        <Tab to="/index/pricing" onClick={toggleMenu}>
          Pricing
        </Tab>
        <Tab to="/index/contact_us" onClick={toggleMenu}>
          Contact
        </Tab>
      </MobileMenu>
    </>
  )

  const HostNav = (
    <>
      <span style={{ fontSize: 24, cursor: "pointer" }} onClick={toggleSidebar}>
        ☰
      </span>
      <LogoContainer src={logoHost} alt="logo" />
      <Button3 onClick={onLogoutClick}>Logout</Button3>
    </>
  )

  const UserNav = (
    <>
      <span style={{ fontSize: 24, cursor: "pointer" }} onClick={toggleSidebar}>
        ☰
      </span>
      <LogoContainer src={logo} alt="logo" />
      <Button1 onClick={onLogoutClick}>Logout</Button1>
    </>
  )

  return (
    <>
      <Popup popUpSettings={popup} />
      <NavbarContainer>
        {role === "guest" && GuestNav}
        {role === "host" && HostNav}
        {role === "user" && UserNav}
      </NavbarContainer>
    </>
  )
}
