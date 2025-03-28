import styled from 'styled-components';
import heroImg from '../../assets/hero.png'
import landing1 from '../../assets/landing1.png'
import landing2 from '../../assets/landing2.png'
import { Button1, Button2 } from '../../components/Navbar/Navbar';

// Responsive breakpoints
const breakpoints = {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px',
  };
  
  // Media query functions
  export const media = {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    laptop: `@media (max-width: ${breakpoints.laptop})`,
    desktop: `@media (max-width: ${breakpoints.desktop})`,
  };
  
  // Styled Components
  const Container = styled.div`
    font-family: 'Arial', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    color: #333;
    overflow-x: hidden;
  `;
  
  const HeroSection = styled.section`
    background-image: url(${heroImg});
    background-size: cover;
    background-position: center;
    color: white;
    padding: 80px 40px;
    position: relative;
    margin-bottom: 40px;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 1;
    }
    
    ${media.tablet} {
      padding: 60px 30px;
    }
    
    ${media.mobile} {
      padding: 40px 20px;
    }
  `;
  
  const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    width: 50%;
    margin: 0 auto;
    text-align: center;
    
    ${media.laptop} {
      width: 70%;
    }
    
    ${media.tablet} {
      width: 100%;
    }
  `;
  
  const Heading1 = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 16px;
    
    ${media.tablet} {
      font-size: 2rem;
    }
    
    ${media.mobile} {
      font-size: 1.8rem;
    }
  `;
  
  const Paragraph = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 24px;
    
    ${media.mobile} {
      font-size: 0.9rem;
    }
  `;
  
  const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    
    ${media.mobile} {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
  `;
  
  const Button = styled.button`
    background-color: white;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  
    &:hover {
      background-color: #f0f0f0;
    }
    
    ${media.mobile} {
      width: 100%;
      margin-bottom: 10px;
    }
  `;
  
  const FeatureSection = styled.section`
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    max-width: 100%;
    
    ${media.laptop} {
      flex-direction: column;
      padding: 40px 30px;
    }
    
    ${media.mobile} {
      padding: 30px 20px;
    }
  `;
  
  const FeatureContent = styled.div`
    width: 45%;
    
    ${media.laptop} {
      width: 100%;
    }
  `;

  const FeatureImage = styled.img`
    max-width: 50%;
    height: auto;
    border-radius: 8px;
    padding: 20px;
    object-fit: contain;
    
    ${media.laptop} {
      width: 100%;
    }
  `;
  
  const FeaturesGrid = styled.section`
    padding: 40px;
    text-align: center;
    margin-bottom: 40px;
    
    ${media.mobile} {
      padding: 30px 20px;
    }
  `;
  
  const FeatureCards = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    ${media.tablet} {
      gap: 20px;
    }
  `;
  
  const FeatureCard = styled.div`
    text-align: left;
    padding: 20px;
    
    ${media.mobile} {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    ${media.laptop} {
        padding: 10px;
      }
  `;

    const FeatureWrapper = styled.div`
    display: flex;
    gap: 1rem;
    flex-direction: row;

    ${media.laptop} {
        flex-direction: column;
        align-items: center;
      }
    `;
  
  const FeatureIcon = styled.div`
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-radius: 50%;
    
    ${media.mobile} {
      margin-right: 0;
      margin-bottom: 15px;
    }
  `;
  
  const FeatureInfo = styled.div`
    flex: 1;
  `;

  const Heading2 = styled.h2`
  font-size: 2rem;
  margin-bottom: 16px;
  text-align: ${props => props.centered ? 'center' : 'left'};
  
  ${media.tablet} {
    font-size: 1.8rem;
  }
  
  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

const Heading3 = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: bold;
  
  ${media.mobile} {
    font-size: 1.1rem;
  }
`;
  
  const CTASection = styled.section`
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    
    ${media.laptop} {
      flex-direction: column-reverse;
      padding: 40px 30px;
    }
    
    ${media.mobile} {
      padding: 30px 20px;
    }
  `;
  
  const CTAContent = styled.div`
    width: 45%;
    
    ${media.laptop} {
      width: 100%;
      margin-top: 30px;
    }
  `;
  
  const CTAImage = styled.img`
    width: 50%;
    height: auto;
    border-radius: 8px;
    
    ${media.laptop} {
      width: 100%;
    }
  `;

export default function LandingPage(){
    return (
        <>
        <HeroSection>
            <HeroContent>
              <Heading1>Experience Engaging Virtual Events Like Never Before</Heading1>
              <Paragraph>Empower your organization with innovative solutions to deliver memorable virtual experiences to your audience.</Paragraph>
              <ButtonGroup>
                <Button1>Get Started</Button1>
                <Button2>Learn More</Button2>
              </ButtonGroup>
            </HeroContent>
          </HeroSection>
        <Container>
          <FeatureSection>
            <FeatureContent>
              <Heading2>Experience Immersive Virtual Events with Interactive Game-Based Engaging Formats</Heading2>
              <Paragraph>Transform ordinary online gatherings into extraordinary experiences with our cutting-edge platform designed for maximum engagement and participant satisfaction.</Paragraph>
            </FeatureContent>
            <CTAImage src={landing2} alt="Interactive Virtual Events" />
          </FeatureSection>
    
          <FeaturesGrid>
            <Heading2 centered>Discover Our Unique Virtual Event Features</Heading2>
            <Paragraph>Our platform includes everything you need to create memorable virtual experiences that your attendees will love.</Paragraph>
            
            <FeatureWrapper>
            <FeatureCards>
              <FeatureCard>
                <FeatureIcon></FeatureIcon>
                <FeatureInfo>
                  <Heading3>Interactive Game Spaces</Heading3>
                  <Paragraph>Engage your audience with interactive games and activities designed to foster connection and collaboration.</Paragraph>
                </FeatureInfo>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon></FeatureIcon>
                <FeatureInfo>
                  <Heading3>Seamless Meeting Integration</Heading3>
                  <Paragraph>Integrate with your favorite video conferencing platforms for a unified experience.</Paragraph>
                </FeatureInfo>
              </FeatureCard>
            </FeatureCards>

            <FeatureImage src={landing1} alt='img'/>

            <FeatureCards>
            <FeatureCard>
                <FeatureIcon></FeatureIcon>
                <FeatureInfo>
                  <Heading3>Virtual Rooms</Heading3>
                  <Paragraph>Create customized spaces for different activities, breakouts, and networking opportunities.</Paragraph>
                </FeatureInfo>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon></FeatureIcon>
                <FeatureInfo>
                  <Heading3>Rich Analytics</Heading3>
                  <Paragraph>Gain insights on participation and engagement to continuously improve your events.</Paragraph>
                </FeatureInfo>
              </FeatureCard>
            </FeatureCards>
            </FeatureWrapper>
            
            {/* <CenteredButtonContainer>
              <Button1>Learn More</Button1>
            </CenteredButtonContainer> */}
          </FeaturesGrid>
    
          <CTASection>
            <CTAContent>
              <Heading2>Unlock New Opportunities with Our Virtual Event Hosting Platform</Heading2>
              <Paragraph>Drive audience engagement, foster meaningful connections, and generate measurable results from every virtual event.</Paragraph>
            </CTAContent>
            <CTAImage src={landing2} alt="Virtual Event Opportunities" />
          </CTASection>
        </Container>
        </>
      );
}