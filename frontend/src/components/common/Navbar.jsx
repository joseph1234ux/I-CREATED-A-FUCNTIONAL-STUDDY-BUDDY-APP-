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
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isAuth = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  return (
    <nav style={{
      background: 'var(--bg-nav, white)',
      borderBottom: '1px solid var(--border-color, #e2e8f0)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      transition: 'background 0.3s ease, border-color 0.3s ease',
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

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

          {/* ★★★ ADMIN LINK - ONLY SHOWS FOR ADMINS ★★★ */}
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
      </div>
    </nav>
  );
};

export default Navbar;