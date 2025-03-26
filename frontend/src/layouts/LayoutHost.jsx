import { Outlet } from "react-router-dom";
//import SidebarAdmin from "../components/Sidebar/SidebarAdmin/SidebarAdmin";
//import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import { MainContainer, MainSection, BodySection } from "./LayoutDefault";
import NavBar from "../components/Navbar/Navbar";

//transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')}; for sidebarr

export default function LayoutHost() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(prevState => !prevState);
//   };

  return (
      <MainContainer>
        <NavBar/>
        <MainSection>
          {/* <SidebarAdmin isOpen={isSidebarOpen} /> */}
          <BodySection
            //style={{ overflow: 'auto', marginLeft: isSidebarOpen ? '248px' : '0', transition: 'margin-left 0.3s ease' }}
          >
            <Outlet />
          </BodySection>
        </MainSection>
      </MainContainer>
  );
}
