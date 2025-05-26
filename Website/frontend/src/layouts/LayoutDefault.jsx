/**
 * Default Layout Component
 *
 * Base layout for public pages and guest users:
 * - Navigation bar for unauthenticated users
 * - Footer with company information
 * - Responsive design for mobile and desktop
 * - Landing page structure and styling
 * - Public route container with consistent branding
 *
 * Used for home page, pricing, contact, and other public pages
 * before user authentication.
 */

import { Outlet } from "react-router-dom";
import styled from 'styled-components'
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const MainContainer = styled.div`
    display: flex; 
    flex-direction: column;
    overflow: clip;
    min-height: 100vh;
    background-color: var(--background-main);
`;

export const BodySection = styled.div`
    width: 100%;
    min-height: calc(100vh - 4rem);
    /*padding: 2rem;*/
    overflow: auto;
    color: var(--text-primary);
`;


export const MainSection = styled.main`
    display:flex;
    top: 6vh;
    flex-grow: 1;
    overflow: auto;
`;

export default function LayoutDefault() {
    return(
        <MainContainer>
            <NavBar role="guest"/>
            <BodySection>
                <Outlet/>
            </BodySection>
            <Footer/>
       </MainContainer>
    )
}