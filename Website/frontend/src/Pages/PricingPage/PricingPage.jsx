/**
 * Pricing Page Component
 *
 * Displays subscription plans and pricing information:
 * - Different subscription tiers and features
 * - Pricing comparison tables
 * - Feature breakdown by plan
 * - Call-to-action for plan selection
 * - Integration with payment processing
 *
 * Helps hosts understand pricing options and select
 * appropriate subscription plans for their event needs.
 */

import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--background-main);
  color: var(--text-primary);
  padding: 3rem 1.5rem;
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--general-bg-base);
  font-size: var(--heading-2);
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: var(--body);
  margin-bottom: 3rem;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const PlanCard = styled.div`
  background-color: var(--background-second);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  transition: 0.3s ease;

  &:hover {
    border-color: var(--general-bg-base-hover);
    box-shadow: 0 0 0 3px var(--general-bg-base-hover);
  }
`;

const PlanTitle = styled.h2`
  font-size: var(--heading-4);
  color: var(--text-second);
  margin-bottom: 0.5rem;
`;

const Price = styled.p`
  font-size: var(--heading-3);
  color: var(--general-bg-base);
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Features = styled.ul`
  text-align: left;
  margin-bottom: 1.5rem;
`;

const Feature = styled.li`
  color: var(--text-secondary);
  font-size: var(--body);
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  background-color: var(--general-bg-base);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: var(--body);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--general-bg-base-hover);
  }
`;

export default function PricingPage() {
  return (
    <Container>
      <Wrapper>
        <Title>Choose Your Plan</Title>
        <Subtitle>Flexible pricing for every kind of event organizer</Subtitle>

        <PlansGrid>
          <PlanCard>
            <PlanTitle>Starter</PlanTitle>
            <Price>Free</Price>
            <Features>
              <Feature>1 active event</Feature>
              <Feature>Up to 25 attendees</Feature>
              <Feature>Basic customization</Feature>
            </Features>
            <Button>Get Started</Button>
          </PlanCard>

          <PlanCard>
            <PlanTitle>Pro</PlanTitle>
            <Price>$29/month</Price>
            <Features>
              <Feature>3 active events</Feature>
              <Feature>Up to 100 attendees</Feature>
              <Feature>Advanced customization</Feature>
              <Feature>Email invitations</Feature>
            </Features>
            <Button>Choose Plan</Button>
          </PlanCard>

          <PlanCard>
            <PlanTitle>Enterprise</PlanTitle>
            <Price>Custom</Price>
            <Features>
              <Feature>Unlimited events</Feature>
              <Feature>Unlimited attendees</Feature>
              <Feature>Full customization</Feature>
              <Feature>Dedicated support</Feature>
            </Features>
            <Button>Contact Sales</Button>
          </PlanCard>
        </PlansGrid>
      </Wrapper>
    </Container>
  );
}