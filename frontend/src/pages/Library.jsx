import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getBookCover } from '../utils/bookCovers';
import { LibraryIcon, BookOpenIcon, HeartIcon, ReadIcon, BookmarkIcon } from '../components/icons';

const Library = () => {
  const [savedStories, setSavedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved');

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token in Library:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');

      if (!token) {
        console.log('❌ No token found');
        setSavedStories([]);
        setLoading(false);
        return;
      }

      console.log('📤 Sending request to /library');

      const response = await api.get('/library', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', response.data);

      let stories = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          stories = response.data;
        } else if (response.data.stories && Array.isArray(response.data.stories)) {
          stories = response.data.stories;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          stories = response.data.data;
        }
      }

      console.log('📊 Extracted stories:', stories.length);
      setSavedStories(stories);
    } catch (error) {
      console.error('❌ Library error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      setSavedStories([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'saved', label: 'Saved', icon: BookmarkIcon },
    { id: 'reading', label: 'Reading', icon: ReadIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: '#808080' }}>
        Loading library...
      </div>
    );
  }

  const stories = Array.isArray(savedStories) ? savedStories : [];

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="container-full">
        <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LibraryIcon size={32} color="#E50914" />
          My Library
        </h1>
        <p style={{ color: '#808080', marginBottom: '24px' }}>
          {stories.length > 0
            ? `You have ${stories.length} saved stories`
            : 'Your library is empty. Start saving stories!'}
        </p>

        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '12px',
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  background: activeTab === tab.id ? '#E50914' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#B3B3B3',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon size={18} color={activeTab === tab.id ? '#ffffff' : '#B3B3B3'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#808080' }}>
            <LibraryIcon size={48} color="#808080" />
            <h3 style={{ marginTop: '16px', color: '#ffffff' }}>Your library is empty</h3>
            <p>Start saving stories you love!</p>
            <Link to="/stories" style={{
              display: 'inline-block',
              marginTop: '16px',
              color: '#E50914',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Browse Stories →
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ReadIcon size={20} color="#E50914" />
                Continue Reading
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}>
                {stories.slice(0, 4).map((story) => (
                  <Link to={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#1F1F1F',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E50914'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                      <img
                        src={getBookCover(story.id)}
                        alt={story.title}
                        style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '12px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{story.title}</h4>
                        <p style={{ fontSize: '12px', color: '#808080' }}>{story.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpenIcon size={20} color="#E50914" />
              All Saved Stories
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              {stories.map((story) => (
                <Link to={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#1F1F1F',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E50914'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <img
                      src={getBookCover(story.id)}
                      alt={story.title}
                      style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{story.title}</h4>
                      <p style={{ fontSize: '12px', color: '#808080' }}>{story.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;