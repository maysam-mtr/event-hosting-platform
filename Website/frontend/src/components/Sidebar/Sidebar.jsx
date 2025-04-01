import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

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
`;

const SidebarItem = styled(Link)`
  padding: 15px 20px;
  color: var(--text-primary);
  text-decoration: none;
  background-color: ${({ $active, $role }) => ($active ? $role === 'host' ? 'var(--host-bg-light)' : "var(--general-bg-light)" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  transition: background 0.3s;

  &:hover {
    background-color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-light)' : "var(--general-bg-light)"};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: var(--text-primary);
`;

export default function Sidebar({ isOpen, toggleSidebar, role }) {
  const location = useLocation();

  return (
    <SidebarContainer $isOpen={isOpen}>
      <CloseButton onClick={toggleSidebar}>×</CloseButton>
      {role === "host" ? (
        <>
          <SidebarItem $role={role} to="/host" $active={location.pathname === "/host"} onClick={() => toggleSidebar()}>
            Home
          </SidebarItem>
          <SidebarItem $role={role} to="/host/my-events" $active={location.pathname === "/host/my-events"} onClick={() => toggleSidebar()}>
            My Events
          </SidebarItem>
          <SidebarItem $role={role} to="/host/settings" $active={location.pathname === "/host/settings"} onClick={() => toggleSidebar()}>
            Settings
          </SidebarItem>
        </>
      ) : (
        <>
          <SidebarItem $role={role} to="/user" $active={location.pathname === "/user"} onClick={() => toggleSidebar()}>
            Home
          </SidebarItem>
          <SidebarItem $role={role} to="/user/explore" $active={location.pathname === "/user/explore"} onClick={() => toggleSidebar()}>
            Explore Events
          </SidebarItem>
          <SidebarItem $role={role} to="/user/settings" $active={location.pathname === "/user/settings"} onClick={() => toggleSidebar()}>
            Settings
          </SidebarItem>
        </>
      )}
    </SidebarContainer>
  );
}

