import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import SkeletonGrid from '../components/SkeletonGrid';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(12);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
    // Reset to page 1 when search/filter changes
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, courses]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data || []);
      const uniqueCategories = [...new Set((response.data || []).map(c => c.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch courses:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses || [];
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    setFilteredCourses(filtered);
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
        alert('Course deleted!');
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Go to next/previous page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            width: '180px', 
            height: '36px', 
            background: '#e2e8f0', 
            borderRadius: '8px',
            marginBottom: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '300px', 
            height: '20px', 
            background: '#e2e8f0', 
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            flex: 1, 
            height: '48px', 
            background: '#e2e8f0', 
            borderRadius: '10px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ 
            width: '180px', 
            height: '48px', 
            background: '#e2e8f0', 
            borderRadius: '10px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
            All Courses
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            {filteredCourses.length === 176 
              ? 'Discover and enroll in our expert-led courses' 
              : `Showing ${filteredCourses.length} of 176 courses`
            }
          </p>
        </div>
        <Link 
          to="/add-course" 
          className="btn-primary"
          style={{ 
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add New Course
        </Link>
      </div>

      {/* Search & Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginTop: '24px', 
        marginBottom: '24px', 
        flexWrap: 'wrap' 
      }}>
        <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search 176 courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field"
          style={{ 
            minWidth: '180px', 
            maxWidth: '220px',
            appearance: 'auto'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results Count & Pagination Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Showing <strong>{filteredCourses.length > 0 ? indexOfFirstCourse + 1 : 0}</strong> to{' '}
          <strong>{Math.min(indexOfLastCourse, filteredCourses.length)}</strong> of{' '}
          <strong>{filteredCourses.length}</strong> courses
        </p>
        {filteredCourses.length > 0 && (
          <span style={{ 
            fontSize: '14px', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Best matches
          </span>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '2px dashed #e2e8f0'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="8" y1="7" x2="16" y2="7"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
              <line x1="8" y1="15" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
            No courses found
          </h3>
          <p style={{ color: '#64748b' }}>
            {searchTerm || selectedCategory ? 'Try adjusting your search or filter' : 'Start by adding your first course!'}
          </p>
          {!searchTerm && !selectedCategory && (
            <Link to="/add-course" className="btn-primary" style={{ 
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Course
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid-3">
            {currentCourses.map((course) => (
              <div key={course.id} className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                padding: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '12px' 
                }}>
                  <span className="badge badge-blue">
                    {course.category || 'Uncategorized'}
                  </span>
                  <span style={{ 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#4f46e5' 
                  }}>
                    ${course.price || '0.00'}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#0f172a', 
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  {course.title || 'Untitled'}
                </h3>
                
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  marginBottom: '16px',
                  flex: '1',
                  lineHeight: '1.6'
                }}>
                  {course.description || 'Learn with expert instructors'}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  borderTop: '1px solid #e2e8f0', 
                  paddingTop: '16px',
                  marginTop: 'auto'
                }}>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="btn-primary"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '13px',
                      flex: '1',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View Details
                  </Link>
                  <button
                    onClick={() => navigate(`/edit-course/${course.id}`)}
                    className="btn-secondary"
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="btn-danger"
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '8px', 
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#4f46e5';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                ← Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first 3, last 3, and pages around current
                  return page <= 3 || page > totalPages - 3 || Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <span 
                        key={`ellipsis-${page}`} 
                        style={{ 
                          padding: '8px 4px', 
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}
                      >
                        …
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '10px 16px',
                        border: currentPage === page ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: currentPage === page ? '#4f46e5' : 'white',
                        color: currentPage === page ? 'white' : '#0f172a',
                        cursor: 'pointer',
                        fontWeight: currentPage === page ? '700' : '500',
                        transition: 'all 0.2s ease',
                        minWidth: '40px'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.target.style.background = '#f1f5f9';
                          e.target.style.borderColor = '#4f46e5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#e2e8f0';
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#4f46e5';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* Show total course count */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px',
            fontSize: '14px',
            color: '#94a3b8'
          }}>
            Showing page {currentPage} of {totalPages} • {filteredCourses.length} courses total
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;