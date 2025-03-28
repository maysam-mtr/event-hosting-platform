import styled from 'styled-components';
import { Button1 } from '../../components/Navbar/Navbar';

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  gap: 1.5rem;
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
`;

const Paragraph = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 20px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

export default function ContactUsPage() {
  return (

      <Container>
        <Heading>Contact Us</Heading>
        <Paragraph>
          Got a technical issue? Want to send feedback about a beta feature? Let us know.
        </Paragraph>
        <Form action='#'>
          <div>
            <Label htmlFor='email'>Your Email</Label>
            <Input type='email' id='email' placeholder='example@gmail.com' />
          </div>
          <div>
            <Label htmlFor='subject'>Subject</Label>
            <Input type='text' id='subject' placeholder='Let us know how we can help' />
          </div>
          <div>
            <Label htmlFor='message'>Your Message</Label>
            <TextArea rows={6} id='message' placeholder='Leave a comment...' />
          </div>
          <Button1 type='button' style={{alignSelf: 'center'}}>Submit</Button1>
        </Form>
      </Container>
   
  );
}
