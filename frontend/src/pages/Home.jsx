import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  RocketLaunchIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Expert Courses',
      desc: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Learning',
      desc: 'Join a vibrant community of learners and grow together'
    },
    {
      icon: TrophyIcon,
      title: 'Earn Certificates',
      desc: 'Get recognized for your achievements with shareable certificates'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Career Growth',
      desc: 'Boost your career with new skills and practical knowledge'
    },
  ];

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#c7d2fe',
            marginBottom: '24px',
          }}>
            🚀 Join 10,000+ learners
          </div>

          <h1>
            Make Studying{' '}
            <span>Social, Fun,</span>
            <br />
            <span>and Collaborative</span>
          </h1>

          <p>
            Join a community of learners. Study together, share knowledge,
            and achieve your goals faster.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started
              <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
            </Link>
            <Link to="/courses" className="btn-outline">
              Browse Courses
            </Link>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>10K+</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>50+</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Courses</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>100+</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Instructors</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-header">
            <h2>Why Choose <span style={{ color: '#4f46e5' }}>StudyBuddy?</span></h2>
            <p>Everything you need to succeed in one platform</p>
          </div>

          <div className="grid-4">
            {features.map((feature, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <feature.icon style={{ width: '32px', height: '32px', color: '#4f46e5' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;