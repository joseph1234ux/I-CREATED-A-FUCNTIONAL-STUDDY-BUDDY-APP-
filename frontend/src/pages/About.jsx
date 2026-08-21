import React from 'react';
import Icon from '../components/common/Icon';

const About = () => {
  return (
    <div style={{ padding: '120px 60px 60px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '48px', marginBottom: '24px', color: '#2c1810' }}>
        About StoryTeller
      </h1>
      <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '16px' }}>
        Welcome to StoryTeller – a place where stories come alive.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '16px' }}>
        We believe that every story has the power to change lives. Whether it's a romance that makes your heart skip, a drama that brings tears to your eyes, or a life-changing novel that shifts your perspective – we have it all.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '16px' }}>
        Our platform is designed for readers who love to discover new worlds, characters, and emotions. Dive in and find your next favorite story today.
      </p>
      <div style={{ marginTop: '40px', padding: '24px', background: '#f5efe9', borderRadius: '12px', border: '1px solid #dccfc4' }}>
        <h3 style={{ fontFamily: "'Georgia', serif", marginBottom: '8px' }}><Icon name="book" size={20} /> Our Collection</h3>
        <p style={{ color: '#4a3528' }}>From romance and drama to comedy and thrillers – we've got stories for every mood.</p>
      </div>
    </div>
  );
};

export default About;
