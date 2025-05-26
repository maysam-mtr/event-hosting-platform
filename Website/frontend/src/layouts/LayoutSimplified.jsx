/**
 * Simplified Layout Component
 *
 * Minimal layout for focused user experiences:
 * - Clean interface without distracting navigation
 * - Used for login, signup, and authentication flows
 * - Error pages and standalone forms
 * - Minimal branding and simplified navigation
 * - Focus on single-task completion
 *
 * Provides distraction-free environment for critical
 * user actions and authentication processes.
 */

import { Outlet } from "react-router-dom";
import { BodySection, MainContainer, MainSection } from "./LayoutDefault";
import NavBar from "../components/Navbar/Navbar";

export default function LayoutSimplified() {
    return(
        <MainContainer>
            {/* <NavBar/> */}
            <MainSection>
                <Outlet/>
            </MainSection>
       </MainContainer>
    )
}