import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { getBookCover } from '../utils/bookCovers';
import { HeartIcon, BookOpenIcon, StarIcon, ReadIcon } from '../components/icons';

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    console.log('🔑 Token from localStorage:', savedToken ? 'Exists' : 'Missing');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    fetchStory();
  }, [id]);

  useEffect(() => {
    if (user && token && story) {
      checkIfSaved();
    }
  }, [user, token, story]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories/${id}`);
      const data = response.data;
      setStory(data);
      setChapters(data.chapters || []);
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      if (!token || !user) {
        console.log('⚠️ No token or user, skipping check');
        return;
      }
      
      console.log('🔍 Checking if story is saved...');
      const response = await api.get(`/library/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Check response:', response.data);
      setIsSaved(response.data.saved || false);
    } catch (error) {
      console.error('Error checking saved status:', error);
      // Check localStorage fallback
      const saved = localStorage.getItem(`saved_${id}`);
      setIsSaved(saved === 'true');
    }
  };

  const handleSave = async () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔑 Token exists?', savedToken ? 'Yes' : 'No');
    console.log('👤 User exists?', savedUser ? 'Yes' : 'No');
    
    if (!savedToken || !savedUser) {
      alert('Please login to save stories');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving story with token:', savedToken.substring(0, 20) + '...');
      
      if (isSaved) {
        // Remove from library
        const response = await api.delete(`/library/${id}`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        console.log('✅ Remove response:', response.data);
        setIsSaved(false);
        localStorage.removeItem(`saved_${id}`);
        alert('Story removed from library!');
      } else {
        // Add to library
        const response = await api.post('/library', { storyId: id }, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        console.log('✅ Save response:', response.data);
        setIsSaved(true);
        localStorage.setItem(`saved_${id}`, 'true');
        alert('Story saved to library!');
      }
    } catch (error) {
      console.error('❌ Error saving story:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      
      // Show user-friendly error
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        alert('Story already saved!');
        setIsSaved(true);
      } else if (error.code === 'ERR_NETWORK') {
        alert('Cannot connect to server. Please make sure the backend is running.');
      } else {
        alert('Failed to save. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: '#808080' }}>
        Loading story...
      </div>
    );
  }

  if (!story) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: '#ffffff' }}>Story Not Found</h2>
        <Link to="/" style={{ color: '#E50914' }}>← Back to Home</Link>
      </div>
    );
  }

  const coverUrl = getBookCover(story.id);
  const status = story.status || 'Ongoing';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingTop: '68px' }}>
      <div className="hero-banner-background" style={{ minHeight: '400px' }}>
        <div className="hero-banner-content">
          <span className="hero-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpenIcon size={14} color="white" />
            {story.category}
          </span>
          <h1 className="hero-title" style={{ fontSize: '40px' }}>{story.title}</h1>
          <div className="hero-meta">
            <span>By {story.author}</span>
            <span>•</span>
            <span className="rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon size={14} color="#FBBF24" />
              {story.rating}
            </span>
            <span>•</span>
            <span>{story.totalReaders} reads</span>
            <span>•</span>
            <span className={`story-card-status ${status === 'Completed' ? 'completed' : 'ongoing'}`}>{status}</span>
            <span>•</span>
            <span>{chapters.length} chapters</span>
          </div>
          <p className="hero-description">{story.description}</p>
          <div className="hero-actions">
            <Link to={`/reader/${story.id}`} className="btn-netflix-red" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ReadIcon size={18} color="white" />
              Read Now
            </Link>
            <button 
              className="btn-netflix-secondary" 
              onClick={handleSave}
              disabled={saving}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: saving ? 0.6 : 1,
                cursor: saving ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '12px 28px',
                background: isSaved ? 'rgba(229,9,20,0.2)' : 'transparent',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              <HeartIcon size={18} color={isSaved ? '#E50914' : 'white'} fill={isSaved ? '#E50914' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        <div className="hero-cover" style={{ width: '240px', height: '340px' }}>
          {!imageError ? (
            <img src={coverUrl} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImageError(true)} />
          ) : (
            <div className="book-cover" style={{ background: 'linear-gradient(135deg, #E50914, #8B5CF6)', fontSize: '60px' }}>📖</div>
          )}
        </div>
      </div>

      <div className="container-full" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpenIcon size={24} color="#E50914" />
            Chapters ({chapters.length})
          </h2>
          {chapters.map((chapter) => (
            <Link 
              key={chapter.id}
              to={`/reader/${story.id}/${chapter.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#1F1F1F',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2A2A2A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1F1F1F'}
              >
                <div>
                  <span style={{ color: '#808080', marginRight: '12px' }}>#{chapter.chapterNumber}</span>
                  <span style={{ color: '#ffffff' }}>{chapter.title}</span>
                </div>
                <span style={{ color: '#808080', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ReadIcon size={14} color="#808080" />
                  Read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryDetail;