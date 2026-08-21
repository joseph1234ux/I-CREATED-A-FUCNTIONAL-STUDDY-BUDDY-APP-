import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import {
  LibraryIcon,
  HeartIcon,
  BookOpenIcon,
  StoriesIcon,
  SettingsIcon,
  // UserIcon,  // ← Remove this line
  BookmarkIcon,
  ReadIcon,
  SettingsIcon as UserIcon
} from '../components/icons';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, []);

  const stats = [
    { label: 'Books Read', value: '42', icon: BookOpenIcon, color: '#8B5CF6' },
    { label: 'Stories Published', value: '8', icon: StoriesIcon, color: '#E50914' },
    { label: 'Favorites', value: '27', icon: HeartIcon, color: '#EF4444' },
    { label: 'Reading Streak', value: '14 days', icon: ReadIcon, color: '#FBBF24' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'library', label: 'Library', icon: LibraryIcon },
    { id: 'stories', label: 'My Stories', icon: StoriesIcon },
    { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
    { id: 'history', label: 'Reading History', icon: ReadIcon },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: '#808080' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#141414' }}>
      <div className="container-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{
          background: '#1A1A1A',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <Avatar user={user} size={120} interactive={false} />
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginTop: '16px',
          }}>
            {user.name || 'User'}
          </h1>
          
          <p style={{
            color: '#808080',
            fontSize: '15px',
            marginBottom: '4px',
          }}>
            @{user.email?.split('@')[0] || 'user'}
          </p>
          
          <p style={{
            color: '#666',
            fontSize: '14px',
            marginTop: '8px',
          }}>
            Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={{
                background: '#1A1A1A',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <Icon size={24} color={stat.color} style={{ marginBottom: '8px' }} />
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#808080',
                }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '4px',
          flexWrap: 'wrap',
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeTab === tab.id ? '#E50914' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#B3B3B3',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} color={activeTab === tab.id ? '#ffffff' : '#808080'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{
          background: '#1A1A1A',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.06)',
          minHeight: '300px',
        }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                Welcome back, {user.name}! 👋
              </h2>
              <p style={{ color: '#808080', lineHeight: '1.8' }}>
                You've read 42 books and published 8 stories on StoryTeller.
                Your favorite genre is Fantasy, and you're on a 14-day reading streak!
              </p>
              <div style={{
                marginTop: '20px',
                padding: '16px 20px',
                background: 'rgba(229,9,20,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(229,9,20,0.1)',
              }}>
                <p style={{ color: '#E50914', fontSize: '14px', fontWeight: '500' }}>
                  🎯 Reading Goal: 50 books this year
                </p>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '3px',
                  marginTop: '8px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '84%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #E50914, #8B5CF6)',
                    borderRadius: '3px',
                  }} />
                </div>
                <p style={{ color: '#808080', fontSize: '12px', marginTop: '6px' }}>
                  42 of 50 books completed (84%)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <LibraryIcon size={48} color="#808080" />
              <h3 style={{ color: '#ffffff', marginTop: '16px' }}>Your Library</h3>
              <p style={{ color: '#808080' }}>You have 12 books in your library</p>
              <button style={{
                marginTop: '16px',
                padding: '10px 24px',
                background: '#E50914',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
                Browse More Books
              </button>
            </div>
          )}

          {activeTab === 'stories' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <StoriesIcon size={48} color="#808080" />
              <h3 style={{ color: '#ffffff', marginTop: '16px' }}>Your Stories</h3>
              <p style={{ color: '#808080' }}>You've published 8 stories</p>
              <button style={{
                marginTop: '16px',
                padding: '10px 24px',
                background: '#E50914',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
                Write New Story
              </button>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <BookmarkIcon size={48} color="#808080" />
              <h3 style={{ color: '#ffffff', marginTop: '16px' }}>Your Bookmarks</h3>
              <p style={{ color: '#808080' }}>You have 15 bookmarks</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <ReadIcon size={48} color="#808080" />
              <h3 style={{ color: '#ffffff', marginTop: '16px' }}>Reading History</h3>
              <p style={{ color: '#808080' }}>You've read 42 books total</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
