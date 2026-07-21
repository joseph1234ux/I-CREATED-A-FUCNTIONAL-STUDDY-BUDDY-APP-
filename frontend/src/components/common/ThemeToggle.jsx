import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: 'var(--text-secondary, #475569)',
      }}
      onMouseEnter={(e) => { e.target.style.background = 'var(--border-color, #e2e8f0)'; }}
      onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon style={{ width: '22px', height: '22px', color: '#fcd34d' }} />
      ) : (
        <MoonIcon style={{ width: '22px', height: '22px', color: '#4f46e5' }} />
      )}
    </button>
  );
};

export default ThemeToggle;