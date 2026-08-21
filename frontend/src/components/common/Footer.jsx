import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from '../icons/index.jsx';

const Footer = () => {
  const socialIcons = [
    { name: 'Twitter', icon: Icons.TwitterIcon },
    { name: 'Instagram', icon: Icons.InstagramIcon },
    { name: 'YouTube', icon: Icons.YouTubeIcon },
    { name: 'TikTok', icon: Icons.TikTokIcon },
  ];

  const links = {
    'Explore': ['Browse Stories', 'Categories', 'Trending', 'New Releases'],
    'Community': ['Write a Story', 'Author Hub', 'Reading Lists', 'Forums'],
    'Support': ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="brand">
            <Link to="/" className="logo" style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Icons.StoriesIcon size={28} color="#E50914" />
              Story<span style={{ color: 'var(--primary)' }}>Teller</span>
            </Link>
            <p>
              Discover amazing stories from talented authors around the world.
              Read, write, and share your imagination.
            </p>
            <div className="social">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.name} href="#" aria-label={social.name}>
                    <Icon size={24} color="#B3B3B3" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4>{title}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="newsletter">
            <h4>Newsletter</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
              Get weekly story recommendations delivered to your inbox.
            </p>
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 StoryTeller. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Icons.HeartIcon size={16} color="#E50914" /> by StoryTeller Team
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;