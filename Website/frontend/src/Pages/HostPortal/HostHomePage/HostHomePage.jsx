import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import hostHero from '../../../assets/heroHost.png';
import { Button3 } from "../../../components/Navbar/Navbar";
import { useState } from "react";
import CreateEventModal from "../CreateEventModal/CreateEventModal";

const HomeContainer = styled.div`
  width: 100vw;
  height: 91vh;
  background: url(${hostHero}) center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  color: white;
  z-index: 2;
`;

const Heading = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: var(--host-bg-base);
  background-color: white;
  padding: 20px;
  border-radius: 40px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

export const Button = styled.button`
  background-color: var(--host-bg-light);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: var(--body);
  border: 0;
  height: fit-content;
  width: fit-content;
  color: var(--text-background);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--general-bg-base-hover);
  }
`;

export default function HostHomePage(){
    const navigate = useNavigate();
  
    return (
      <>
        <HomeContainer>
          <Content>
            <Heading>Start Your Journey Now!</Heading>
            <CreateEventModal/>
          </Content>
        </HomeContainer>
      </>
    );
}