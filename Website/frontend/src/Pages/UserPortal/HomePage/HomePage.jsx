import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import skyImg from '../../../assets/sky.png';
import { Button1, Button2 } from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
import Input from "../../../components/Input/Input";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const HomeContainer = styled.div`
  width: 100vw;
  height: 90vh;
  background: url(${skyImg}) center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
  color: var(--general-bg-base);
  background-color: white;
  padding: 20px;
  border-radius: 40px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid var(--general-bg-base);
`;

const Tab = styled.div`
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  background-color: ${props => (props.active ? "var(--general-bg-base)" : "white")};
  color: ${props => (props.active ? "white" : "black")};
  border-top-left-radius: ${props => (props.first ? "10px" : "0")};
  border-top-right-radius: ${props => (props.last ? "10px" : "0")};
`;

export const Button = styled.button`
  background-color: var(--general-bg-base);
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

const Container = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
`;


export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventID, setEventID] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const onJoinEventClick = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    
    async function handleJoinEvent() {
        if(!eventID){
          setError("Please enter event code");
          return;
        }

        setError("");
        closeModal();
        navigate(`/event/details/${eventID}`, {replace: true});
    };
  
    return (
      <>
        <HomeContainer>
          {/* <Overlay /> */}
          <Content>
            <Heading>Start Your Journey Now!</Heading>
            <Button1 onClick={onJoinEventClick}>Join Event</Button1>
          </Content>
        </HomeContainer>
  
        {/* Modal that opens when user clicks "Join Event" */}
        <Modal isOpen={isModalOpen} closeModal={closeModal} title="View Event">
            <Container>
              <Input
                      type="text"
                      placeholder="Enter Event code"
                      name='id'
                      data={eventID}
                      setData={setEventID}
                      required={true}
                      label='Code'
              />

              <ErrorMessage message={error}/>
              
              <Button onClick={() => handleJoinEvent()} style={{alignSelf: 'end'}}>Go!</Button>
            </Container>
        </Modal>
      </>
    );
  }
