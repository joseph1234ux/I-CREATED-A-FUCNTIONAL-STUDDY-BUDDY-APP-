import { useState, useEffect } from 'react';
import api from '../api/axios';
import StarRating from './StarRating';

const ReviewList = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    } else {
      console.warn('ReviewList: No courseId provided');
      setLoading(false);
    }
  }, [courseId]);

  const fetchReviews = async () => {
    if (!courseId) {
      console.warn('fetchReviews: courseId is undefined');
      return;
    }
    
    try {
      console.log('Fetching reviews for courseId:', courseId);
      const response = await api.get(`/courses/${courseId}/reviews`);
      console.log('Reviews response:', response.data);
      setReviews(response.data);
      
      if (user) {
        const myReview = response.data.find(r => r.userId === user.id);
        if (myReview) {
          setUserReview(myReview);
          setRating(myReview.rating);
          setComment(myReview.comment);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!courseId) {
      setError('Course ID is missing');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 3) {
      setError('Please write a comment (minimum 3 characters)');
      return;
    }

    try {
      const response = await api.post(`/courses/${courseId}/reviews`, {
        rating,
        comment: comment.trim()
      });
      
      setSuccess('Review added successfully!');
      setUserReview(response.data.review);
      await fetchReviews();
      setComment('');
      setRating(0);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Submit review error:', error);
      setError(error.response?.data?.message || 'Failed to add review');
    }
  };

  const handleEdit = (review) => {
    setEditing(true);
    setEditId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (editRating === 0) {
      setError('Please select a rating');
      return;
    }

    if (editComment.trim().length < 3) {
      setError('Please write a comment (minimum 3 characters)');
      return;
    }

    try {
      await api.put(`/reviews/${editId}`, {
        rating: editRating,
        comment: editComment.trim()
      });
      
      setSuccess('Review updated successfully!');
      setEditing(false);
      await fetchReviews();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Update review error:', error);
      setError(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      setSuccess('Review deleted successfully!');
      setUserReview(null);
      setRating(0);
      setComment('');
      await fetchReviews();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Delete review error:', error);
      setError(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditId(null);
    setEditRating(0);
    setEditComment('');
    setError('');
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading reviews...</div>;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Review Form */}
      {user && !userReview && !editing && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Write a Review
          </h4>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                background: '#fee2e2', 
                color: '#991b1b', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{ 
                background: '#d1fae5', 
                color: '#065f46', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {success}
              </div>
            )}
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>
                Rating
              </label>
              <StarRating rating={rating} onRatingChange={setRating} size={32} />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Share your experience with this course..."
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Your Review
          </h4>
          <form onSubmit={handleUpdate}>
            {error && (
              <div style={{ 
                background: '#fee2e2', 
                color: '#991b1b', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div style={{ 
                background: '#d1fae5', 
                color: '#065f46', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {success}
              </div>
            )}
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>
                Rating
              </label>
              <StarRating rating={editRating} onRatingChange={setEditRating} size={32} />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>
                Comment
              </label>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="input-field"
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">
                Update Review
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="13" x2="13" y2="13"/>
          </svg>
          All Reviews ({reviews.length})
        </h4>
        
        {reviews.length === 0 ? (
          <p style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>
            No reviews yet. Be the first to review this course!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: '#4f46e5'
                      }}>
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <strong>{review.user?.name || 'Anonymous'}</strong>
                        <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '8px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={review.rating} readonly size={18} />
                    <p style={{ marginTop: '8px', color: '#1e293b', lineHeight: '1.6' }}>
                      {review.comment}
                    </p>
                  </div>
                  
                  {user && review.userId === user.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(review)}
                        className="btn-secondary"
                        style={{ 
                          padding: '4px 12px', 
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
                        onClick={() => handleDelete(review.id)}
                        className="btn-danger"
                        style={{ 
                          padding: '4px 12px', 
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;