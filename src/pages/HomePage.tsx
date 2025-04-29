import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styled from 'styled-components';
import { Button, Card, Section } from '../styles/Theme';

const HeroSection = styled.div`
  text-align: center;
  padding: var(--spacing-xxl) 0;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: var(--spacing-lg);
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-secondary);
`;

const FeatureCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
`;

const FeatureCard = styled(Card)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: var(--spacing-md);
`;

const CallToAction = styled.div`
  text-align: center;
  margin: var(--spacing-xxl) 0;
`;

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/login';
    
    if (user.role === 'teacher') {
      return '/teacher';
    } else if (user.role === 'student') {
      return '/student';
    }
    
    return '/';
  };
  
  return (
    <>
      <HeroSection>
        <HeroTitle>ברוכים הבאים ל-QuizMaster</HeroTitle>
        <HeroSubtitle>פלטפורמה מתקדמת לניהול מבחנים אמריקאיים למורים ותלמידים</HeroSubtitle>
        
        {isAuthenticated ? (
          <Button as={Link} to={getDashboardLink()}>כניסה ללוח הבקרה</Button>
        ) : (
          <div>
            <Button as={Link} to="/register" style={{ marginLeft: 'var(--spacing-md)' }}>הרשמה</Button>
            <Button as={Link} to="/login" variant="outline">התחברות</Button>
          </div>
        )}
      </HeroSection>
      
      <Section>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>תכונות מרכזיות</h2>
        
        <FeatureCards>
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <h3>ניהול שאלות</h3>
            <p>צור, ערוך ונהל מאגר שאלות אמריקאיות בממשק פשוט וידידותי.</p>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <h3>מבחנים מותאמים</h3>
            <p>תלמידים יכולים לקחת מבחנים אקראיים המבוססים על מאגר השאלות.</p>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <h3>ניתוח תוצאות</h3>
            <p>קבל ציונים והערכות מיידיות עם משוב מפורט לאחר השלמת המבחן.</p>
          </FeatureCard>
        </FeatureCards>
      </Section>
      
      <CallToAction>
        <h2>מוכנים להתחיל?</h2>
        <p style={{ marginBottom: 'var(--spacing-lg)' }}>צור חשבון והתחל להשתמש במערכת עוד היום!</p>
        
        {isAuthenticated ? (
          <Button as={Link} to={getDashboardLink()}>כניסה ללוח הבקרה</Button>
        ) : (
          <Button as={Link} to="/register">הרשמה עכשיו</Button>
        )}
      </CallToAction>
    </>
  );
};

export default HomePage;