/**
 * Host Layout Component
 *
 * Layout for authenticated host users:
 * - Host-specific navigation with event management options
 * - Sidebar with host dashboard navigation
 * - Host-themed styling and branding
 * - Event creation and management tools access
 * - Host profile and settings integration
 *
 * Provides the main interface for event organizers
 * to manage their events and view analytics.
 */

import { Outlet } from "react-router-dom";
import { useState } from "react";
import { MainContainer, MainSection, BodySection } from "./LayoutDefault";
import NavBar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

export default function LayoutHost() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
      <MainContainer>
        <NavBar role={'host'} toggleSidebar={toggleSidebar}/>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="host" />
        <MainSection style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s ease" }}>
          <Outlet />
        </MainSection>
      </MainContainer>
  );
}
