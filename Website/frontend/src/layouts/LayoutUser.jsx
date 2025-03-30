import { Outlet } from "react-router-dom";
import { useState } from "react";
import { BodySection, MainContainer } from "./LayoutDefault";
import NavBar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function LayoutUser() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <MainContainer>
      <NavBar role="user" toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="user" />
      <BodySection style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s ease" }}>
        <Outlet />
      </BodySection>
    </MainContainer>
  );
}