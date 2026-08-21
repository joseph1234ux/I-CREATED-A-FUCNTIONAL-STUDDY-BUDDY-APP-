import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getBookCover } from '../utils/bookCovers';
import { StoriesIcon, StarIcon, ReadIcon, SearchIcon } from '../components/icons';

const STORIES_PER_PAGE = 150;
const MAX_STORIES = 300;

const Stories = () => {
  const [allStories, setAllStories] = useState([]);
  const [displayedStories, setDisplayedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalStories, setTotalStories] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stories');
      let stories = [];
      if (response.data && response.data.stories) {
        stories = response.data.stories;
      } else if (Array.isArray(response.data)) {
        stories = response.data;
      }
      
      // Limit to 300 stories
      const limited = stories.slice(0, MAX_STORIES);
      setAllStories(limited);
      setTotalStories(limited.length);
      
      // Load first batch
      const initialBatch = limited.slice(0, STORIES_PER_PAGE);
      setDisplayedStories(initialBatch);
      setHasMore(limited.length > STORIES_PER_PAGE);
      setPage(1);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * STORIES_PER_PAGE;
    
    // Simulate loading delay for UX
    setTimeout(() => {
      const nextBatch = allStories.slice(0, end);
      setDisplayedStories(nextBatch);
      setPage(nextPage);
      setHasMore(nextBatch.length < allStories.length && nextBatch.length < MAX_STORIES);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, loadingMore, allStories]);

  // Filter and sort stories
  const getFilteredStories = () => {
    let filtered = displayedStories;
    
    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(story => story.category === selectedGenre);
    }
    
    // Sort
    switch(sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.totalReaders || 0) - (a.totalReaders || 0));
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'az':
        filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredStories = getFilteredStories();

  // Get unique genres
  const genres = ['All', ...new Set(allStories.map(s => s.category))];

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', color: '#808080' }}>
        Loading stories...
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="container-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StoriesIcon size={32} color="#E50914" />
              All Stories
            </h1>
            <p style={{ color: '#808080' }}>
              {totalStories > 0 ? (
                <>Showing {filteredStories.length} of {totalStories} stories</>
              ) : (
                'No stories found'
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1F1F1F', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <SearchIcon size={18} color="#808080" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  padding: '4px 8px',
                  minWidth: '180px',
                }}
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                padding: '8px 16px',
                background: '#1F1F1F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                background: '#1F1F1F',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        {filteredStories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#808080' }}>
            <StoriesIcon size={48} color="#808080" />
            <h3 style={{ marginTop: '16px', color: '#ffffff' }}>No stories found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '24px',
            }}>
              {filteredStories.map((story) => (
                <Link 
                  key={story.id} 
                  to={`/stories/${story.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#1F1F1F',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.borderColor = '#E50914';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={getBookCover(story.id)} 
                        alt={story.title}
                        style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        background: story.status === 'Completed' ? 'rgba(34,197,94,0.8)' : 'rgba(251,191,36,0.8)',
                        color: 'white',
                      }}>
                        {story.status || 'Ongoing'}
                      </span>
                    </div>
                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '2px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {story.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#808080', marginBottom: '4px' }}>{story.author}</p>
                      <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>{story.category}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: '11px', color: '#808080' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <StarIcon size={12} color="#FBBF24" />
                          {story.rating || '4.5'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ReadIcon size={12} color="#808080" />
                          {story.totalReaders || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More / End of Stories */}
            {filteredStories.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                {hasMore && filteredStories.length < totalStories ? (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{
                      padding: '12px 40px',
                      background: '#E50914',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loadingMore ? 'not-allowed' : 'pointer',
                      opacity: loadingMore ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Stories'}
                  </button>
                ) : (
                  <div style={{ 
                    padding: '40px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>✨</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      You've reached the end
                    </h3>
                    <p style={{ color: '#808080', fontSize: '16px' }}>
                      {totalStories >= MAX_STORIES 
                        ? `You've explored all ${MAX_STORIES} stories on StoryTeller.`
                        : `You've explored all ${totalStories} stories in this category.`}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                      <Link to="/" style={{
                        padding: '10px 24px',
                        background: '#E50914',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                      }}>
                        Browse Genres
                      </Link>
                      <Link to="/" style={{
                        padding: '10px 24px',
                        background: 'transparent',
                        color: '#B3B3B3',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}>
                        Return Home
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stories;