/**
 * Footer Component
 *
 * Application footer with navigation and information links:
 * - Company information and branding
 * - Navigation links to important pages
 * - Contact information and support links
 * - Social media links and external resources
 * - Copyright and legal information
 *
 * Provides consistent footer across all public pages
 * and maintains brand presence throughout the application.
 */

import styled from "styled-components";

const FooterContainer = styled.div`
  background-color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-base)' : "var(--general-bg-base)"};
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #fff;
  font-size: 14px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 100px;
  margin: 10px;
`;

const Title = styled.h4`
  font-weight: normal;
  margin-bottom: 10px;
  color: ${({ $role }) => $role === 'host' ? 'var(--host-bg-dark)' : "var(--general-bg-dark)"};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
  cursor: pointer;
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
`;

const Links = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
align-items: center;
text-align: center;
`;

export default function Footer({role = 'guest'}) {
  return (
    <FooterContainer $role={role}>
        <Links>
      <Column>
        <Title $role={role}>Quick Links</Title>
        <List>
          <ListItem>About Us</ListItem>
          <ListItem>Contact Us</ListItem>
          <ListItem>Support Center</ListItem>
          <ListItem>Blog Posts</ListItem>
          <ListItem>FAQs</ListItem>
        </List>
      </Column>
      <Column>
        <Title $role={role}>Resources</Title>
        <List>
          <ListItem>Help Center</ListItem>
          <ListItem>Community Forum</ListItem>
          <ListItem>Event Calendar</ListItem>
          <ListItem>Webinars</ListItem>
          <ListItem>User Guides</ListItem>
        </List>
      </Column>
      <Column>
        <Title $role={role}>Company Info</Title>
        <List>
          <ListItem>Careers</ListItem>
          <ListItem>Press Releases</ListItem>
          <ListItem>Privacy Policy</ListItem>
          <ListItem>Terms of Service</ListItem>
          <ListItem>Sitemap</ListItem>
        </List>
      </Column>
      <Column>
        <Title $role={role}>Connect</Title>
        <List>
          <ListItem>Facebook</ListItem>
          <ListItem>Twitter</ListItem>
          <ListItem>LinkedIn</ListItem>
          <ListItem>Instagram</ListItem>
          <ListItem>YouTube</ListItem>
        </List>
      </Column>
      <Column>
        <Title $role={role}>Support</Title>
        <List>
          <ListItem>Contact Support</ListItem>
          <ListItem>Submit Feedback</ListItem>
          <ListItem>Report Issue</ListItem>
          <ListItem>User Testimonials</ListItem>
          <ListItem>Community Guidelines</ListItem>
        </List>
      </Column>
      <Column>
        <Title $role={role}>Legal</Title>
        <List>
          <ListItem>Terms of Use</ListItem>
          <ListItem>Cookie Policy</ListItem>
          <ListItem>Data Protection</ListItem>
          <ListItem>User Agreement</ListItem>
          <ListItem>Feedback</ListItem>
        </List>
      </Column>
      </Links>
      <Copyright>
        &copy; 2025 Eventure. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}
