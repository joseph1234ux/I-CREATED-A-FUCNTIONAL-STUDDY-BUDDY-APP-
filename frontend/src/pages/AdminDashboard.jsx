import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  UsersIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenue: 0
  });
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(savedUser);
    if (userData.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    setUser(userData);
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch courses
      const coursesRes = await api.get('/courses');
      setCourses(coursesRes.data || []);
      
      // Fetch users (we'll use the enrollments to get user data)
      const enrollRes = await api.get('/users/enrollments');
      
      // Calculate stats
      const totalCourses = coursesRes.data?.length || 0;
      const totalEnrollments = enrollRes.data?.length || 0;
      
      setStats({
        totalUsers: 1, // You'll need a /users endpoint for real count
        totalCourses,
        totalEnrollments,
        revenue: totalEnrollments * 29.99 // Example calculation
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Delete this course permanently?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchAdminData();
        alert('Course deleted!');
      } catch (error) {
        alert('Error deleting course');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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

  const statCards = [
    { icon: UsersIcon, label: 'Total Users', value: stats.totalUsers, color: '#4f46e5' },
    { icon: BookOpenIcon, label: 'Total Courses', value: stats.totalCourses, color: '#7c3aed' },
    { icon: UserGroupIcon, label: 'Enrollments', value: stats.totalEnrollments, color: '#f59e0b' },
    { icon: CurrencyDollarIcon, label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: '#10b981' },
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChartBarIcon style={{ width: '28px', height: '28px', color: '#4f46e5' }} />
            Admin Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>Manage your courses, users, and analytics</p>
        </div>
        <Link to="/add-course" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircleIcon style={{ width: '20px', height: '20px' }} />
          Add Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            background: 'white',
            padding: '20px 24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '700' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'white',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        {['overview', 'courses', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              background: activeTab === tab ? '#4f46e5' : 'transparent',
              color: activeTab === tab ? 'white' : '#475569',
              transition: 'all 0.2s',
              flex: 1
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      import { UsersIcon } from '@heroicons/react/24/outline';

// Add this button in the header section:
<Link to="/admin/users" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <UsersIcon style={{ width: '20px', height: '20px' }} />
  Manage Users
</Link>

      {/* Tab Content */}
      {activeTab === 'courses' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>All Courses</h3>
            <span style={{ fontSize: '14px', color: '#64748b' }}>{courses.length} courses</span>
          </div>
          <div>
            {courses.map((course) => (
              <div key={course.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.target.style.background = 'white'; }}>
                <div>
                  <h4 style={{ fontWeight: '600' }}>{course.title}</h4>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span className="badge badge-blue">{course.category}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>${course.price}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>👨‍🎓 {course.totalStudents || 0}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/edit-course/${course.id}`} style={{
                    padding: '6px 14px',
                    background: '#eef2ff',
                    color: '#4f46e5',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}>
                    <PencilIcon style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                    Edit
                  </Link>
                  <button onClick={() => deleteCourse(course.id)} style={{
                    padding: '6px 14px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    <TrashIcon style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Users</h3>
          </div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <UsersIcon style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 12px' }} />
            <p style={{ color: '#64748b' }}>User management coming soon</p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>You'll be able to view and manage all users here</p>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpenIcon style={{ width: '20px', height: '20px' }} />
              Quick Stats
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{stats.totalCourses}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Courses</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{stats.totalEnrollments}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Enrollments</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{stats.totalUsers}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Users</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>${stats.revenue.toFixed(2)}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Revenue</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AcademicCapIcon style={{ width: '20px', height: '20px' }} />
              Recent Activity
            </h3>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#64748b' }}>No recent activity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;