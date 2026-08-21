import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getBookCover } from '../utils/bookCovers';
import { getReadingHistory } from '../utils/readingHistory';
import {
  StarIcon,
  ReadIcon,
  BookOpenIcon,
  HeartIcon,
  ProfileIcon,
  LibraryIcon,
} from '../components/icons';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [continueReading, setContinueReading] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRefs = useRef({});

  useEffect(() => {
    fetchStories();
    loadContinueReading();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Fetch up to 200 stories to have enough for all sections
      const response = await api.get('/stories?limit=200');
      let data = [];
      if (Array.isArray(response.data)) data = response.data;
      else if (response.data && Array.isArray(response.data.stories)) data = response.data.stories;
      else if (response.data && Array.isArray(response.data.data)) data = response.data.data;
      // Filter out poetry – poems belong on their own page
      const filtered = data.filter(s => s.category !== 'Poetry');
      setStories(filtered);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadContinueReading = () => {
    const history = getReadingHistory();
    const fetchRecent = async () => {
      const promises = history.slice(0, 6).map(async (item) => {
        try {
          const res = await api.get(`/stories/${item.storyId}`);
          return { ...res.data, chapterId: item.chapterId, chapterNumber: item.chapterNumber, progress: item.progress || 0 };
        } catch {
          return null;
        }
      });
      const results = (await Promise.all(promises)).filter(Boolean);
      setContinueReading(results);
    };
    if (history.length > 0) fetchRecent();
  };

  // --- CAROUSEL AUTO-PLAY ---
  const featuredStories = stories.slice(0, 6);
  
  useEffect(() => {
    if (featuredStories.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, stories]);

  // --- ROWS ---
  // Trending: sort by totalReaders
  const trending = [...stories].sort((a, b) => (b.totalReaders || 0) - (a.totalReaders || 0)).slice(0, 30);
  // New Releases: sort by createdAt
  const newReleases = [...stories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 30);
  // Top Rated: sort by rating
  const topRated = [...stories].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 30);

  // Genre rows: group by category, take top 30 per genre
  const genreMap = {};
  stories.forEach(s => {
    if (!genreMap[s.category]) genreMap[s.category] = [];
    genreMap[s.category].push(s);
  });
  // Sort genres by story count descending
  const sortedGenres = Object.keys(genreMap).sort((a, b) => genreMap[b].length - genreMap[a].length);
  // Build rows for top genres (excluding Poetry which is filtered out)
  const genreRows = sortedGenres.map(genre => ({
    genre,
    stories: genreMap[genre].slice(0, 30)
  })).filter(row => row.stories.length > 0);

  const topAuthors = [...new Set(stories.map(s => s.author))].slice(0, 8);

  const scrollRow = (rowId, direction) => {
    const container = carouselRefs.current[rowId];
    if (container) {
      const scrollAmount = 280 + 20;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount * 3 : scrollAmount * 3,
        behavior: 'smooth',
      });
    }
  };

  const genres = [
    { name: 'Fantasy', icon: '🧙', color: '#8B5CF6' },
    { name: 'Romance', icon: '❤️', color: '#EC4899' },
    { name: 'Mystery', icon: '🔍', color: '#3B82F6' },
    { name: 'Horror', icon: '👻', color: '#EF4444' },
    { name: 'Drama', icon: '🎭', color: '#F59E0B' },
    { name: 'Sci-Fi', icon: '🚀', color: '#22C55E' },
    { name: 'Psychological', icon: '🧠', color: '#8B5CF6' },
    { name: 'Comedy', icon: '😂', color: '#FBBF24' },
  ];

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', textAlign: 'center', color: '#808080' }}>
        Loading stories...
      </div>
    );
  }

  const renderStoryRow = (title, storiesArray, rowId, linkTo = '/stories') => {
    if (!storiesArray || storiesArray.length === 0) return null;
    return (
      <section style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>{title}</h2>
          <Link to={linkTo} style={{ color: '#E50914', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            View All →
          </Link>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => scrollRow(rowId, 'left')}
            style={{
              position: 'absolute',
              left: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(229,9,20,0.6)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
          >
            ‹
          </button>
          <div
            ref={(el) => (carouselRefs.current[rowId] = el)}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              padding: '8px 4px 20px 4px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {storiesArray.map((story) => (
              <Link
                to={`/stories/${story.id}`}
                key={story.id}
                style={{ textDecoration: 'none', flex: '0 0 180px' }}
              >
                <div
                  style={{
                    background: '#1A1A1A',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = '#E50914';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(229,9,20,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={getBookCover(story.id)}
                    alt={story.title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {story.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#808080' }}>{story.author}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', color: '#FBBF24' }}>
                        <StarIcon size={12} color="#FBBF24" fill="#FBBF24" />
                        {story.rating || 4.0}
                      </span>
                      <span style={{ fontSize: '12px', color: '#808080' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#808080' }}>{story.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={() => scrollRow(rowId, 'right')}
            style={{
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(229,9,20,0.6)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
          >
            ›
          </button>
        </div>
      </section>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: '60px' }}
    >
      {/* ========== HERO CAROUSEL ========== */}
      <section
        style={{
          position: 'relative',
          height: '85vh',
          minHeight: '500px',
          maxHeight: '750px',
          overflow: 'hidden',
          marginBottom: '40px',
          borderRadius: '0 0 30px 30px',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          {featuredStories.length > 0 && (
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${getBookCover(featuredStories[activeSlide].id)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.15,
                  filter: 'blur(4px) scale(1.05)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.4) 60%, rgba(13,13,13,0.2) 100%)',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 48px',
                  maxWidth: '1200px',
                  margin: '0 auto',
                }}
              >
                <div style={{ maxWidth: '600px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'rgba(229,9,20,0.15)',
                      color: '#E50914',
                      padding: '6px 18px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                      border: '1px solid rgba(229,9,20,0.2)',
                    }}
                  >
                    🔥 Featured Story
                  </span>
                  <h1
                    style={{
                      fontSize: '52px',
                      fontWeight: '800',
                      fontFamily: 'Georgia, serif',
                      lineHeight: '1.08',
                      marginBottom: '12px',
                      color: '#fff',
                      textShadow: '0 2px 30px rgba(0,0,0,0.5)',
                    }}
                  >
                    {featuredStories[activeSlide].title}
                  </h1>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      fontSize: '14px',
                      color: '#B3B3B3',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: '600' }}>
                      {featuredStories[activeSlide].author}
                    </span>
                    <span>•</span>
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        padding: '2px 14px',
                        borderRadius: '12px',
                      }}
                    >
                      {featuredStories[activeSlide].category}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarIcon size={16} color="#FBBF24" fill="#FBBF24" />
                      {featuredStories[activeSlide].rating || 4.5}
                    </span>
                    <span>•</span>
                    <span>{featuredStories[activeSlide].totalReaders || 0} reads</span>
                  </div>
                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.7',
                      color: '#B3B3B3',
                      maxWidth: '480px',
                      marginBottom: '28px',
                    }}
                  >
                    {featuredStories[activeSlide].description || 'A captivating story waiting for you.'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link
                      to={`/reader/${featuredStories[activeSlide].id}`}
                      style={{
                        background: 'linear-gradient(135deg, #E50914, #F40612)',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 34px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(229,9,20,0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = '0 6px 30px rgba(229,9,20,0.5)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = '0 4px 20px rgba(229,9,20,0.3)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <ReadIcon size={18} color="#fff" />
                      Read Now
                    </Link>
                    <Link
                      to={`/stories/${featuredStories[activeSlide].id}`}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '14px 34px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.06)';
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10,
          }}
        >
          {featuredStories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              style={{
                width: activeSlide === index ? '32px' : '10px',
                height: '10px',
                borderRadius: '10px',
                border: 'none',
                background: activeSlide === index ? '#E50914' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + featuredStories.length) % featuredStories.length)}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(229,9,20,0.6)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
        >
          ‹
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % featuredStories.length)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(229,9,20,0.6)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
        >
          ›
        </button>
      </section>

      {/* ========== CONTINUE READING ========== */}
      {continueReading.length > 0 && (
        <section style={{ padding: '0 24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpenIcon size={24} color="#E50914" />
              Continue Reading
            </h2>
            <span style={{ color: '#808080', fontSize: '14px' }}>Pick up where you left off</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {continueReading.slice(0, 6).map((story) => (
              <Link
                to={`/reader/${story.id}/${story.chapterId}`}
                key={story.id}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#1A1A1A',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#E50914';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(229,9,20,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={getBookCover(story.id)}
                    alt={story.title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                      {story.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#808080', marginBottom: '8px' }}>
                      Chapter {story.chapterNumber}
                    </p>
                    <div
                      style={{
                        height: '4px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '6px',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${story.progress || 0}%`,
                          background: 'linear-gradient(90deg, #E50914, #8B5CF6)',
                          borderRadius: '4px',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', color: '#808080' }}>
                      {story.progress || 0}% complete · Continue reading →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========== GENRE GRID (Browse) ========== */}
      <section style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LibraryIcon size={24} color="#E50914" />
          Browse by Genre
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          {genres.map((genre) => {
            const count = stories.filter(s => s.category === genre.name).length;
            return (
              <Link
                to={`/stories?genre=${genre.name}`}
                key={genre.name}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${genre.color}20, ${genre.color}08)`,
                    borderRadius: '12px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    border: `1px solid ${genre.color}20`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = genre.color;
                    e.currentTarget.style.boxShadow = `0 8px 30px ${genre.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${genre.color}20`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{genre.icon}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{genre.name}</h4>
                  <p style={{ fontSize: '12px', color: '#808080' }}>{count} stories</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========== STORY ROWS ========== */}
      {renderStoryRow('🔥 Trending Stories', trending, 'trending')}
      {renderStoryRow('✨ New Releases', newReleases, 'newReleases')}
      {renderStoryRow('⭐ Top Rated', topRated, 'topRated')}

      {/* ========== GENRE ROWS (30 stories each) ========== */}
      {genreRows.map((row) => (
        renderStoryRow(`${row.genre} Stories`, row.stories, `genre-${row.genre}`, `/stories?genre=${row.genre}`)
      ))}

      {/* ========== TOP AUTHORS ========== */}
      <section style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ProfileIcon size={24} color="#E50914" />
          Top Authors
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
          }}
        >
          {topAuthors.map((author) => {
            const authorStories = stories.filter(s => s.author === author);
            return (
              <Link
                to={`/author/${authorStories[0]?.authorId || 1}`}
                key={author}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#1A1A1A',
                    borderRadius: '12px',
                    padding: '20px 16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#E50914';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E50914, #8B5CF6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#fff',
                      margin: '0 auto 10px',
                    }}
                  >
                    {author[0]}
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{author}</h4>
                  <p style={{ fontSize: '12px', color: '#808080' }}>{authorStories.length} stories</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========== QUOTE & NEWSLETTER ========== */}
      <section
        style={{
          margin: '0 24px 40px',
          padding: '40px 32px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(229,9,20,0.08), rgba(139,92,246,0.08))',
          border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            marginBottom: '8px',
          }}
        >
          “A reader lives a thousand lives before he dies...”
        </h3>
        <p style={{ color: '#808080', fontSize: '14px', marginBottom: '20px' }}>
          Join our community of passionate readers and discover your next favorite story.
        </p>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#E50914';
              e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #E50914, #8B5CF6)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 20px rgba(229,9,20,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Subscribe
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;