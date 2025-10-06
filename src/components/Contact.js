import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const ContactContainer = styled.section`
  padding: 100px 20px;
  background: ${props => props.theme.background};
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 18px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled.div``;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
    border-color: ${props => props.theme.accent};
  }
`;

const ContactIcon = styled.div`
  font-size: 24px;
  margin-right: 16px;
  color: ${props => props.theme.accent};
`;

const ContactDetails = styled.div``;

const ContactLabel = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const ContactValue = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const ContactForm = styled.form`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.theme.accent};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: ${props => props.theme.accentHover};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 50%;
  color: ${props => props.theme.text};
  text-decoration: none;
  font-size: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.accent};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Thank you for your message! I\'ll get back to you soon.');
    }, 2000);
  };

  return (
    <ContactContainer id="contact">
      <Container>
        <SectionTitle
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I'm always interested in new opportunities and exciting projects. Let's connect!
        </SectionSubtitle>

        <ContactContent>
          <ContactInfo>
            <ContactItem
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ContactIcon>📧</ContactIcon>
              <ContactDetails>
                <ContactLabel>Email</ContactLabel>
                <ContactValue>impravin22@gmail.com</ContactValue>
              </ContactDetails>
            </ContactItem>

            <ContactItem
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ContactIcon>📱</ContactIcon>
              <ContactDetails>
                <ContactLabel>Phone</ContactLabel>
                <ContactValue>+886 958 605 515</ContactValue>
              </ContactDetails>
            </ContactItem>

            <ContactItem
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <ContactIcon>📍</ContactIcon>
              <ContactDetails>
                <ContactLabel>Location</ContactLabel>
                <ContactValue>Taipei, Taiwan</ContactValue>
              </ContactDetails>
            </ContactItem>

            <ContactItem
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ContactIcon>💼</ContactIcon>
              <ContactDetails>
                <ContactLabel>Status</ContactLabel>
                <ContactValue>Open to new opportunities</ContactValue>
              </ContactDetails>
            </ContactItem>
          </ContactInfo>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ContactForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <TextArea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </SubmitButton>
            </ContactForm>
          </motion.div>
        </ContactContent>

        <SocialLinks>
          <SocialLink href="https://github.com/impravin22" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </SocialLink>
          <SocialLink href="https://linkedin.com/in/praveen-kumar-chittem" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </SocialLink>
          <SocialLink href="mailto:impravin22@gmail.com">
            <i className="fas fa-envelope"></i>
          </SocialLink>
          <SocialLink href="/Praveen%20Kumar%20Chittem%20CV.pdf" target="_blank">
            <i className="fas fa-file-pdf"></i>
          </SocialLink>
        </SocialLinks>
      </Container>
    </ContactContainer>
  );
};

export default Contact;
