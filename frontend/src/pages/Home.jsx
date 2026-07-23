import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  RocketLaunchIcon,
  ArrowRightIcon,
  BookOpenIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../api/axios';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    students: '10K+',
    courses: '50+',
    instructors: '100+'
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchFeaturedCourses();
    fetchStats();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await api.get('/courses');
      // Get first 4 courses as featured
      const courses = response.data || [];
      setFeaturedCourses(courses.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch featured courses:', error);
      // Fallback to empty array
      setFeaturedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/courses');
      const courses = response.data || [];
      // Update stats with real data
      setStats({
        students: '10K+',
        courses: `${courses.length}+`,
        instructors: '100+'
      });
    } catch (error) {
      // Keep default stats if API fails
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
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

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.students}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.courses}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Courses</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{stats.instructors}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="section-header">
            <h2>Featured <span style={{ color: '#4f46e5' }}>Courses</span></h2>
            <p>Handpicked courses to start your learning journey</p>
          </div>

          {loading ? (
            <div className="course-grid">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text medium"></div>
                </div>
              ))}
            </div>
          ) : featuredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <BookOpenIcon style={{ width: '64px', height: '64px', color: '#94a3b8', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>No courses yet</h3>
              <p style={{ color: '#64748b' }}>Check back soon for new courses!</p>
            </div>
          ) : (
            <div className="course-grid">
              {featuredCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <span className="course-badge">{course.category || 'Uncategorized'}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">
                    {course.description || 'Learn with expert instructors'}
                  </p>
                  <div className="course-meta">
                    <span>⭐ 4.5 (120 reviews)</span>
                    <span>👨‍🎓 45 students</span>
                  </div>
                  <div className="course-footer">
                    <span className="course-price">${course.price || '29.99'}</span>
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '14px' }}
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/courses" className="btn-primary" style={{ padding: '14px 40px' }}>
              View All Courses
              <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose StudyBuddy Section */}
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

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '48px',
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            borderRadius: '24px',
            border: '1px solid #c7d2fe'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ color: '#475569', fontSize: '18px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Join thousands of students and start your learning journey today.
            </p>
            <Link to="/register" className="btn-primary" style={{ padding: '14px 48px' }}>
              Get Started Now
              <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;