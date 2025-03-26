import styled from "styled-components";
import { Link } from "react-router-dom";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: var(--background-main);
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
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
  transition: background 0.3s;

  &:hover {
    background-color: var(--general-bg-light);
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
  return (
    <SidebarContainer isOpen={isOpen}>
      <CloseButton onClick={toggleSidebar}>×</CloseButton>
      {role === "host" ? (
        <>
          <SidebarItem to="/host/dashboard">Dashboard</SidebarItem>
          <SidebarItem to="/host/events">My Events</SidebarItem>
          <SidebarItem to="/host/settings">Settings</SidebarItem>
        </>
      ) : (
        <>
          <SidebarItem to="/user">Home</SidebarItem>
          <SidebarItem to="/user/settings">Settings</SidebarItem>
        </>
      )}
    </SidebarContainer>
  );
}
