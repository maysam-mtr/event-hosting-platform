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