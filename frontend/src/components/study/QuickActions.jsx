import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  TrophyIcon, 
  FireIcon 
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    { icon: AcademicCapIcon, label: 'AI Tutor', color: '#4f46e5', link: '/ai-tutor' },
    { icon: BookOpenIcon, label: 'Unlimited Notes', color: '#7c3aed', link: '/notes' },
    { icon: TrophyIcon, label: 'JAMB Prep', color: '#f59e0b', link: '/jamb' },
    { icon: FireIcon, label: 'Focus Mode', color: '#10b981', link: '/focus' },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
        ⚡ Quick Actions
      </h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
        Jump into your CS learning journey now
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
      }}>
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              textDecoration: 'none',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${action.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <action.icon style={{ width: '20px', height: '20px', color: action.color }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
              {action.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;