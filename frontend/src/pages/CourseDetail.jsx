import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import LessonProgress from '../components/LessonProgress';
import Certificate from '../components/Certificate';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';
import PaystackButton from '../components/PaystackButton';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate('/courses');
      return;
    }
    fetchCourse();
    checkEnrollment();
    fetchReviews();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get('/users/enrollments');
      const enrolled = response.data.find(e => e.courseId === parseInt(id));
      if (enrolled) {
        setIsEnrolled(true);
        setEnrollmentProgress(enrolled.progress || 0);
      }
    } catch (error) {
      console.log('Not logged in or enrollment check failed');
    }
  };

  const fetchReviews = async () => {
    try {
      if (!id) return;
      const response = await api.get(`/courses/${id}/reviews`);
      const reviews = response.data;
      setReviewCount(reviews.length);
      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.log('Error fetching reviews:', error);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      setEnrollmentProgress(0);
      alert('🎉 Successfully enrolled in the course!');
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCertificate = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to view certificate');
      return;
    }
    setShowCertificate(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #e2e8f0', 
          borderTop: '4px solid #4f46e5', 
          borderRadius: '50%', 
          margin: '0 auto',
          animation: 'spin 1s linear infinite' 
        }} />
        <div style={{ marginTop: '16px', fontSize: '18px', color: '#64748b' }}>Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', color: '#991b1b' }}>
          {error || 'Course not found'}
        </div>
        <Link to="/courses">
          <button style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Back to Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>Home</Link>
        <span> / </span>
        <Link to="/courses" style={{ color: '#4f46e5', textDecoration: 'none' }}>Courses</Link>
        <span> / </span>
        <span style={{ color: '#0f172a' }}>{course.title}</span>
      </div>

      {/* Course Title */}
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>
        {course.title}
      </h1>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px' }}>
          {course.category}
        </span>
        <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StarRating rating={averageRating || course.rating || 0} readonly size={16} />
          <span>{averageRating || course.rating || 0} ({reviewCount} reviews)</span>
        </span>
        <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {course.totalStudents || 0} students
        </span>
        <span style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          {course.duration || '10 hours'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* MAIN CONTENT - LEFT SIDE */}
        <div>
          {/* About Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              About this course
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              {course.description || 'No description available.'}
            </p>
            {course.instructor && (
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Instructor: <strong>{course.instructor}</strong>
              </p>
            )}
          </div>

          {/* Course Content - Lessons */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Course Content
            </h3>
            {course.lessons && course.lessons.length > 0 ? (
              <LessonProgress lessons={course.lessons} courseId={course.id} />
            ) : (
              <p style={{ color: '#64748b' }}>No lessons available for this course yet.</p>
            )}
          </div>

          {/* ⭐ Reviews & Ratings Section */}
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Reviews & Ratings
            </h3>
            <ReviewList courseId={parseInt(id)} />
          </div>
        </div>

        {/* SIDEBAR - RIGHT SIDE */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            position: 'sticky',
            top: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5', marginBottom: '8px' }}>
              ${course.price || '0.00'}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              One-time payment
            </div>

            {isEnrolled ? (
              <div>
                <div style={{
                  width: '100%',
                  padding: '12px',
                  background: '#d1fae5',
                  color: '#065f46',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Enrolled
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                    <span>Progress</span>
                    <span>{enrollmentProgress}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '4px' }}>
                    <div className="progress-fill" style={{ width: `${enrollmentProgress}%` }} />
                  </div>
                </div>
                
                {enrollmentProgress === 100 && (
                  <button
                    onClick={handleCertificate}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                    Get Certificate
                  </button>
                )}
              </div>
            ) : (
              // ===== PAYMENT / ENROLL BUTTON =====
              course.price > 0 ? (
                // Paid Course - Show Paystack Button
                <>
                  <div style={{
                    background: '#fef3c7',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#92400e',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Secure payment with Paystack
                  </div>
                  <PaystackButton
                    courseId={course.id}
                    courseTitle={course.title}
                    amount={course.price}
                    onSuccess={() => {
                      setIsEnrolled(true);
                      setEnrollmentProgress(0);
                      alert('🎉 Payment successful! You are now enrolled!');
                      fetchCourse();
                    }}
                    onClose={() => {}}
                  />
                </>
              ) : (
                // Free Course - Show Free Enroll Button
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'background 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#4338ca'}
                  onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                </button>
              )
            )}

            {/* Instructor */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Instructor
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#4f46e5'
                }}>
                  {course.instructor?.charAt(0) || 'A'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {course.instructor || 'Admin'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Expert Instructor
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <Certificate
          userName={JSON.parse(localStorage.getItem('user'))?.name || 'Student'}
          courseTitle={course.title}
          date={new Date().toLocaleDateString()}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default CourseDetail;