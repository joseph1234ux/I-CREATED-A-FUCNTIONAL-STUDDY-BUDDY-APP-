import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  UserCircleIcon, 
  ChartBarIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  UserIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const isAuth = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav style={{
      background: 'var(--bg-nav, white)',
      borderBottom: '1px solid var(--border-color, #e2e8f0)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      transition: 'background 0.3s ease, border-color 0.3s ease',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '20px',
          fontWeight: '800',
          color: 'var(--text-primary, #0f172a)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <BookOpenIcon style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
          <span>Study<span style={{ color: '#4f46e5' }}>Buddy</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-menu" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Link to="/" style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
          >
            <HomeIcon style={{ width: '18px', height: '18px' }} />
            Home
          </Link>
          
          <Link to="/courses" style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
          >
            <BookOpenIcon style={{ width: '18px', height: '18px' }} />
            Courses
          </Link>
          
          {isAuth && (
            <Link to="/profile" style={{
              color: 'var(--text-secondary, #475569)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
            >
              <UserIcon style={{ width: '18px', height: '18px' }} />
              Profile
            </Link>
          )}
          
          {isAuth && (
            <Link to="/dashboard" style={{
              color: 'var(--text-secondary, #475569)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
            >
              <ChartBarIcon style={{ width: '18px', height: '18px' }} />
              Dashboard
            </Link>
          )}

          {/* ADMIN LINK - ONLY SHOWS FOR ADMINS */}
          {isAuth && isAdmin && (
            <Link to="/admin" style={{
              color: '#92400e',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              padding: '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#fde68a'; }}
            onMouseLeave={(e) => { e.target.style.background = '#fef3c7'; }}
            >
              <ShieldCheckIcon style={{ width: '18px', height: '18px', color: '#d97706' }} />
              Admin
            </Link>
          )}
          
          <Link to="/about" style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
          >
            <InformationCircleIcon style={{ width: '18px', height: '18px' }} />
            About
          </Link>
          
          <Link to="/contact" style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#4f46e5'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #475569)'; }}
          >
            <EnvelopeIcon style={{ width: '18px', height: '18px' }} />
            Contact
          </Link>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {!isAuth ? (
            <>
              <Link to="/login" style={{
                color: 'var(--text-secondary, #475569)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                <ArrowRightOnRectangleIcon style={{ width: '18px', height: '18px' }} />
                Login
              </Link>
              <Link to="/register" style={{
                background: '#4f46e5',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#4338ca'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'; }}
              onMouseLeave={(e) => { e.target.style.background = '#4f46e5'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
              >
                <UserCircleIcon style={{ width: '18px', height: '18px' }} />
                Register
              </Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <Link to="/add-course" style={{
                  color: '#4f46e5',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#eef2ff',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#e0e7ff'; }}
                onMouseLeave={(e) => { e.target.style.background = '#eef2ff'; }}
                >
                  <PlusCircleIcon style={{ width: '18px', height: '18px' }} />
                  New
                </Link>
              )}
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary, #0f172a)',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <UserCircleIcon style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                {user?.name}
              </span>
              <button 
                onClick={handleLogout} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                <ArrowRightOnRectangleIcon style={{ width: '18px', height: '18px' }} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu Button - Mobile */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hamburger-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
        >
          {isMenuOpen ? (
            <XMarkIcon style={{ width: '28px', height: '28px', color: 'var(--text-primary, #0f172a)' }} />
          ) : (
            <Bars3Icon style={{ width: '28px', height: '28px', color: 'var(--text-primary, #0f172a)' }} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          background: 'var(--bg-nav, white)',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          padding: '16px 24px',
          display: 'none',
          flexDirection: 'column',
          gap: '4px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}>
          <Link to="/" onClick={handleLinkClick} style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <HomeIcon style={{ width: '20px', height: '20px' }} />
            Home
          </Link>
          
          <Link to="/courses" onClick={handleLinkClick} style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <BookOpenIcon style={{ width: '20px', height: '20px' }} />
            Courses
          </Link>
          
          {isAuth && (
            <Link to="/profile" onClick={handleLinkClick} style={{
              color: 'var(--text-secondary, #475569)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              padding: '10px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              <UserIcon style={{ width: '20px', height: '20px' }} />
              Profile
            </Link>
          )}
          
          {isAuth && (
            <Link to="/dashboard" onClick={handleLinkClick} style={{
              color: 'var(--text-secondary, #475569)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              padding: '10px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
            >
              <ChartBarIcon style={{ width: '20px', height: '20px' }} />
              Dashboard
            </Link>
          )}

          {/* Admin Link - Mobile */}
          {isAuth && isAdmin && (
            <Link to="/admin" onClick={handleLinkClick} style={{
              color: '#92400e',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              padding: '10px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#fde68a'; }}
            onMouseLeave={(e) => { e.target.style.background = '#fef3c7'; }}
            >
              <ShieldCheckIcon style={{ width: '20px', height: '20px', color: '#d97706' }} />
              Admin
            </Link>
          )}
          
          <Link to="/about" onClick={handleLinkClick} style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <InformationCircleIcon style={{ width: '20px', height: '20px' }} />
            About
          </Link>
          
          <Link to="/contact" onClick={handleLinkClick} style={{
            color: 'var(--text-secondary, #475569)',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            <EnvelopeIcon style={{ width: '20px', height: '20px' }} />
            Contact
          </Link>
          
          {/* Theme Toggle - Mobile */}
          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary, #475569)' }}>Theme</span>
            <ThemeToggle />
          </div>
          
          {!isAuth ? (
            <>
              <Link to="/login" onClick={handleLinkClick} style={{
                color: 'var(--text-secondary, #475569)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                padding: '10px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                Login
              </Link>
              <Link to="/register" onClick={handleLinkClick} style={{
                background: '#4f46e5',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '600',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#4338ca'; }}
              onMouseLeave={(e) => { e.target.style.background = '#4f46e5'; }}
              >
                <UserCircleIcon style={{ width: '20px', height: '20px' }} />
                Register
              </Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <Link to="/add-course" onClick={handleLinkClick} style={{
                  color: '#4f46e5',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#eef2ff',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#e0e7ff'; }}
                onMouseLeave={(e) => { e.target.style.background = '#eef2ff'; }}
                >
                  <PlusCircleIcon style={{ width: '20px', height: '20px' }} />
                  Add Course
                </Link>
              )}
              <div style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid var(--border-color, #e2e8f0)',
                marginTop: '4px',
                paddingTop: '12px',
              }}>
                <UserCircleIcon style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary, #0f172a)',
                }}>{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#dc2626',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
                onMouseEnter={(e) => { e.target.style.background = '#fee2e2'; }}
                onMouseLeave={(e) => { e.target.style.background = '#fef2f2'; }}
              >
                <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px' }} />
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style>{`
        /* Hide desktop menu on mobile */
        @media (max-width: 1024px) {
          .desktop-menu {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .mobile-menu {
            display: flex !important;
          }
        }

        /* Show desktop menu on larger screens */
        @media (min-width: 1025px) {
          .mobile-menu {
            display: none !important;
          }
        }

        /* Hide hamburger on desktop */
        @media (min-width: 1025px) {
          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;