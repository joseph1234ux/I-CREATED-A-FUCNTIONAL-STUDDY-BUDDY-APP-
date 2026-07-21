import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  FireIcon,
  ArrowRightIcon,
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  UserCircleIcon,
  SparklesIcon,
  PencilSquareIcon,
  ComputerDesktopIcon,
  QueueListIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import PomodoroTimer from '../components/study/PomodoroTimer';
import StudySession from '../components/study/StudySession';
import api from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (!saved) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(saved));
    fetchEnrolledCourses();
  }, [navigate]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/users/enrollments');
      setEnrolledCourses(response.data);
    } catch (error) {
      console.log('No enrolled courses yet');
      setEnrolledCourses([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #e2e8f0', 
          borderTop: '4px solid #4f46e5', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
      </div>
    );
  }

  const stats = [
    { icon: BookOpenIcon, label: 'Enrolled Courses', value: enrolledCourses.length, color: '#eef2ff' },
    { icon: CheckCircleIcon, label: 'Completed Courses', value: enrolledCourses.filter(c => c.completed).length, color: '#d1fae5' },
    { icon: ClockIcon, label: 'Hours Learned', value: '12.5', color: '#e0e7ff' },
    { icon: FireIcon, label: 'Day Streak', value: '5', color: '#fef3c7' },
  ];

  const recent = [
    { title: 'Web Development', progress: 75, status: 'In Progress' },
    { title: 'Data Science', progress: 30, status: 'In Progress' },
    { title: 'UI/UX Design', progress: 0, status: 'Not Started' },
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <UserCircleIcon style={{ width: '36px', height: '36px', color: '#4f46e5' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>
          Welcome back, {user.name}!
        </h1>
        <span style={{ fontSize: '24px' }}>👋</span>
      </div>
      <p style={{ color: '#64748b', marginBottom: '32px', paddingLeft: '4px' }}>
        Ready to focus? Start a new study session with our advanced timer and progress tracking
      </p>

      {/* Stats */}
      <div className="dashboard-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-box">
            <div className="stat-box-icon" style={{ background: s.color }}>
              <s.icon style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
            </div>
            <div>
              <div className="stat-box-value">{s.value}</div>
              <div className="stat-box-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SparklesIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
          Quick Actions
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
          Jump into your CS learning journey now
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}>
          {[
            { icon: AcademicCapIcon, label: 'AI Tutor', color: '#4f46e5', link: '/ai-tutor' },
            { icon: PencilSquareIcon, label: 'Unlimited Notes', color: '#7c3aed', link: '/notes' },
            { icon: TrophyIcon, label: 'JAMB Prep', color: '#f59e0b', link: '/jamb' },
            { icon: FireIcon, label: 'Focus Mode', color: '#10b981', link: '/focus' },
          ].map((action, index) => (
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
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${action.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
              }}>
                <action.icon style={{ width: '24px', height: '24px', color: action.color }} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* My Courses Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpenIcon style={{ width: '20px', height: '20px' }} />
          My Courses
        </h3>
        
        {loadingEnrollments ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '3px solid #e2e8f0', 
              borderTop: '3px solid #4f46e5', 
              borderRadius: '50%', 
              margin: '0 auto',
              animation: 'spin 1s linear infinite' 
            }} />
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <BookOpenIcon style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>No courses yet</h4>
            <p style={{ color: '#64748b' }}>Enroll in your first course to get started!</p>
            <Link to="/courses" className="btn-primary" style={{ 
              marginTop: '16px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <BookOpenIcon style={{ width: '16px', height: '16px' }} />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontWeight: '600', fontSize: '16px' }}>
                    {enrollment.course?.title || 'Course'}
                  </h4>
                  {enrollment.completed && (
                    <span style={{ 
                      background: '#d1fae5', 
                      color: '#065f46', 
                      padding: '2px 10px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircleIcon style={{ width: '14px', height: '14px' }} />
                      Done
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  {enrollment.course?.category || 'Uncategorized'}
                </p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                    <span>Progress</span>
                    <span>{enrollment.progress || 0}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '4px' }}>
                    <div className="progress-fill" style={{ width: `${enrollment.progress || 0}%` }} />
                  </div>
                </div>
                <Link 
                  to={`/courses/${enrollment.courseId}`} 
                  className="btn-secondary" 
                  style={{ 
                    marginTop: '12px', 
                    width: '100%', 
                    textAlign: 'center', 
                    padding: '8px', 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
                  {enrollment.completed ? 'Review Course' : 'Continue Learning'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Study Tools */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', 
        gap: '24px',
        marginBottom: '32px',
      }}>
        <div>
          <PomodoroTimer />
        </div>
        <div>
          <StudySession />
        </div>
      </div>

      {/* Recent Courses & Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QueueListIcon style={{ width: '20px', height: '20px' }} />
            Recent Courses
          </h3>
          {recent.map((c, i) => (
            <div key={i} style={{ 
              padding: '12px 0', 
              borderBottom: i < recent.length - 1 ? '1px solid #e2e8f0' : 'none' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{c.title}</p>
                  <span className="badge badge-blue">{c.status}</span>
                </div>
                <span style={{ fontWeight: '600' }}>{c.progress}%</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '6px' }}>
                <div className="progress-fill" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChartPieIcon style={{ width: '20px', height: '20px' }} />
            Quick Links
          </h3>
          <Link to="/courses" className="btn-primary" style={{ 
            width: '100%', 
            justifyContent: 'center', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <BookOpenIcon style={{ width: '20px', height: '20px' }} />
            Browse Courses
          </Link>
          <button className="btn-secondary" style={{ 
            width: '100%', 
            justifyContent: 'center', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
            Continue Learning
          </button>
          <button className="btn-secondary" style={{ 
            width: '100%', 
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ChartBarIcon style={{ width: '20px', height: '20px' }} />
            View Certificates
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;