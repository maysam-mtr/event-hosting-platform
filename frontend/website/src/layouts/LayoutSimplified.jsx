import { Outlet } from "react-router-dom";
import { BodySection, MainContainer } from "./LayoutDefault";
import NavBar from "../components/Navbar/Navbar";

export default function LayoutSimplified() {
    return(
        <MainContainer>
            {/* <NavBar/> */}
            <BodySection>
                <Outlet/>
            </BodySection>
       </MainContainer>
    )
}