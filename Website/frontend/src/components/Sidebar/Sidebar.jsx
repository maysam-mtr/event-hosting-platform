/**
 * Sidebar Component
 *
 * A collapsible sidebar navigation component that provides role-based
 * navigation links and quick access to different application sections.
 *
 * Key Features:
 * - Slide-in/slide-out animation with smooth transitions
 * - Role-based menu items (Host vs User navigation)
 * - Active route highlighting with visual feedback
 * - Responsive positioning with z-index management
 * - Close button for easy dismissal
 *
 * Props:
 * - isOpen: boolean to control sidebar visibility
 * - toggleSidebar: function to handle sidebar open/close
 * - role: 'host' or 'user' for role-specific navigation items
 *
 * Navigation includes:
 * Host: Home, My Events, Settings
 * User: Home, Explore Events, Collaborated Events (if partner), Settings
 *
 * Integrates with user state to show partner-specific options
 * and provides consistent navigation experience
 */

import styled from "styled-components"
import { Link, useLocation } from "react-router-dom"
import useUserState from "../../hooks/use-user-state"

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: var(--background-main);
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? "0" : "-255px")};
  transition: left 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  z-index: 1100;
`

const SidebarItem = styled(Link)`
  padding: 15px 20px;
  color: var(--text-primary);
  text-decoration: none;
  background-color: ${({ $active, $role }) => ($active ? ($role === "host" ? "var(--host-bg-light)" : "var(--general-bg-light)") : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  transition: background 0.3s;

  &:hover {
    background-color: ${({ $role }) => ($role === "host" ? "var(--host-bg-light)" : "var(--general-bg-light)")};
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: var(--text-primary);
`

export default function Sidebar({ isOpen, toggleSidebar, role }) {
  const location = useLocation()
  const { user } = useUserState()

  return (
    <SidebarContainer $isOpen={isOpen}>
      <CloseButton onClick={toggleSidebar}>×</CloseButton>
      {role === "host" ? (
        <>
          <SidebarItem $role={role} to="/host" $active={location.pathname === "/host"} onClick={() => toggleSidebar()}>
            Home
          </SidebarItem>
          <SidebarItem
            $role={role}
            to="/host/my-events"
            $active={location.pathname === "/host/my-events"}
            onClick={() => toggleSidebar()}
          >
            My Events
          </SidebarItem>
          <SidebarItem
            $role={role}
            to="/host/settings"
            $active={location.pathname === "/host/settings"}
            onClick={() => toggleSidebar()}
          >
            Settings
          </SidebarItem>
        </>
      ) : (
        <>
          <SidebarItem $role={role} to="/user" $active={location.pathname === "/user"} onClick={() => toggleSidebar()}>
            Home
          </SidebarItem>
          <SidebarItem
            $role={role}
            to="/user/explore"
            $active={location.pathname === "/user/explore"}
            onClick={() => toggleSidebar()}
          >
            Explore Events
          </SidebarItem>
          {user.isPartner === 1 && (
            <SidebarItem
              $role={role}
              to="/user/collaborated-events"
              $active={location.pathname === "/user/collaborated-events"}
              onClick={() => toggleSidebar()}
            >
              Collaborated Events
            </SidebarItem>
          )}
          <SidebarItem
            $role={role}
            to="/user/settings"
            $active={location.pathname === "/user/settings"}
            onClick={() => toggleSidebar()}
          >
            Settings
          </SidebarItem>
        </>
      )}
    </SidebarContainer>
  )
}
