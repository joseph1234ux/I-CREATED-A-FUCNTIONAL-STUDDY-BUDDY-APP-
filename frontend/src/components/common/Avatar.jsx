import React from 'react';

const Avatar = ({
  user,
  size = 40,
  onClick,
  className = '',
  showBorder = true,
  interactive = true
}) => {
  // If user has uploaded avatar
  if (user?.avatar) {
    return (
      <div
        className={`avatar-container ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          cursor: interactive ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          border: showBorder ? '2px solid rgba(255,255,255,0.1)' : 'none',
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          if (interactive) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#E50914';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(229,9,20,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (interactive) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <img
          src={user.avatar}
          alt={user.name || 'User'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`avatar-container ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 35%, #f3b6cc 0 12%, transparent 13%), radial-gradient(circle at 50% 50%, #8b5cf6 0 29%, transparent 30%), linear-gradient(135deg, #34204a, #e5097f)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: showBorder ? '2px solid rgba(255,255,255,0.1)' : 'none',
        userSelect: 'none',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.borderColor = '#E50914';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(229,9,20,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <span aria-label="StoryTeller default avatar" style={{ width: size * 0.5, height: size * 0.25, borderRadius: '50% 50% 42% 42%', background: 'rgba(255,255,255,0.9)', marginTop: size * 0.32 }} />
    </div>
  );
};

export default Avatar;
