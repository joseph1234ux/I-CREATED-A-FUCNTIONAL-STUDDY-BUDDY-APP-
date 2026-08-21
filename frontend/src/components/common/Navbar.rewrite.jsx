import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  StoriesIcon,
  PoemsIcon,
  LibraryIcon,
  StoreIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
} from './icons';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.avatar-wrapper')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const avatarText = () => {
    if (!user) return '?';
    return (user.name || user.email || 'User')[0].toUpperCase();
  };

  const avatarColor = () => {
    const palette = ['#E50914', '#8B5CF6', '#22C55E', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#F97316'];
    if (!user?.email) return palette[0];
    return palette[user.email.length % palette.length];
  };

  return (
    <>
      <nav className={`netflix-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo">
          <StoriesIcon size={28} color="#E50914" />
          Story<span>Teller</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="active">
            <HomeIcon size={18} color="#B3B3B3" />
            Home
          </Link>
          <Link to="/stories">
            <StoriesIcon size={18} color="#B3B3B3" />
            Stories
          </Link>
          <Link to="/poems">
            <PoemsIcon size={18} color="#B3B3B3" />
            Poems
          </Link>
          <Link to="/library">
            <LibraryIcon size={18} color="#B3B3B3" />
            Library
          </Link>
          <Link to="/store">
            <StoreIcon size={18} color="#B3B3B3" />
            Store
          </Link>
        </div>

        <div className="nav-actions">
          <button type="button" className="search-btn" onClick={() => setSearchOpen(true)}>
            <SearchIcon size={20} color="#B3B3B3" />
          </button>

          {user ? (
            <div className="avatar-wrapper" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                style={avatarStyle(avatarColor())}
              >
                {avatarText()}
              </button>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  <div style={dropdownHeaderStyle}>
                    <div style={dropdownNameStyle}>{user.name || 'User'}</div>
                    <div style={dropdownEmailStyle}>{user.email || 'user@storyteller.com'}</div>
                  </div>

                  <button type="button" style={dropdownButtonStyle} onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                    👤 Profile
                  </button>
                  <button type="button" style={dropdownButtonStyle} onClick={() => { setDropdownOpen(false); navigate('/library'); }}>
                    📚 Library
                  </button>
                  <button type="button" style={dropdownButtonStyle} onClick={() => { setDropdownOpen(false); navigate('/stories'); }}>
                    📖 Stories
                  </button>
                  <div style={dropdownDividerStyle} />
                  <button type="button" style={logoutButtonStyle} onClick={handleLogout}>
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={authButtonGroupStyle}>
              <Link to="/login" style={linkStyle}>
                Sign In
              </Link>
              <Link to="/register" style={primaryLinkStyle}>
                Sign Up
              </Link>
            </div>
          )}

          <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenuOpen((prev) => !prev)} style={mobileMenuButtonStyle}>
            {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={mobileMenuStyle}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
            Home
          </Link>
          <Link to="/stories" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
            Stories
          </Link>
          <Link to="/poems" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
            Poems
          </Link>
          <Link to="/library" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
            Library
          </Link>
          <Link to="/store" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
            Store
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>
                Profile
              </Link>
              <button type="button" style={mobileLogoutStyle} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div style={mobileAuthGroupStyle}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={mobileSecondaryButtonStyle}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={mobilePrimaryButtonStyle}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={searchOverlayStyle}>
            <div style={searchPanelStyle}>
              <input type="text" placeholder="Search stories, poems, authors..." autoFocus style={searchInputStyle} />
              <button type="button" onClick={() => setSearchOpen(false)} style={searchCloseButtonStyle}>
                <CloseIcon size={24} color="#B3B3B3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const avatarStyle = (bg) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${bg}, #111111)`,
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 10px)',
  right: 0,
  width: '240px',
  background: '#111111',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
  overflow: 'hidden',
  zIndex: 1000,
};

const dropdownHeaderStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const dropdownNameStyle = {
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '15px',
  marginBottom: '4px',
};

const dropdownEmailStyle = {
  color: '#8e8e8e',
  fontSize: '13px',
};

const dropdownButtonStyle = {
  width: '100%',
  padding: '12px 20px',
  background: 'transparent',
  border: 'none',
  color: '#b3b3b3',
  fontSize: '14px',
  textAlign: 'left',
  cursor: 'pointer',
};

const dropdownDividerStyle = {
  height: '1px',
  background: 'rgba(255,255,255,0.08)',
  margin: '0 16px',
};

const logoutButtonStyle = {
  ...dropdownButtonStyle,
  color: '#EF4444',
};

const authButtonGroupStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
};

const linkStyle = {
  color: '#B3B3B3',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '8px 16px',
};

const primaryLinkStyle = {
  ...linkStyle,
  background: '#E50914',
  color: '#ffffff',
  borderRadius: '4px',
};

const mobileMenuButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#B3B3B3',
  cursor: 'pointer',
  padding: '8px',
};

const mobileMenuStyle = {
  position: 'fixed',
  top: '68px',
  left: 0,
  right: 0,
  background: '#111111',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  padding: '18px 24px',
  zIndex: 999,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const mobileLinkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px 0',
  fontSize: '16px',
};

const mobileLogoutStyle = {
  background: 'none',
  border: 'none',
  color: '#EF4444',
  fontSize: '16px',
  textAlign: 'left',
  cursor: 'pointer',
  padding: '12px 0',
};

const mobileAuthGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const mobileSecondaryButtonStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center',
  fontWeight: 600,
};

const mobilePrimaryButtonStyle = {
  ...mobileSecondaryButtonStyle,
  background: '#E50914',
};

const searchOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.88)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
};

const searchPanelStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '720px',
};

const searchInputStyle = {
  width: '100%',
  padding: '18px 20px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  fontSize: '16px',
  outline: 'none',
};

const searchCloseButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'none',
  border: 'none',
  color: '#B3B3B3',
  cursor: 'pointer',
};

export default Navbar;
