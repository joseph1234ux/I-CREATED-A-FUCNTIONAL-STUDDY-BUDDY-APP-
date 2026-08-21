import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ story }) => {
  if (!story) return null;

  const emojis = {
    'Romance': '❤️',
    'Drama': '🎭',
    'Fantasy': '🐉',
    'Sci-Fi': '🚀',
    'Thriller': '🔪',
    'Mystery': '🔍',
    'Adventure': '🗺️',
    'Comedy': '😂',
    'Horror': '👻',
    'Historical': '🏛️',
    'Coming of Age': '🌱',
    'Slice of Life': '☕',
    'Action': '💥',
    'Crime': '🚔',
    'Psychological': '🧠',
    'Life-Changing': '✨'
  };

  const coverEmoji = emojis[story.category] || '📖';

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge" style={{
              display: 'inline-block',
              background: 'rgba(236, 72, 153, 0.15)',
              color: 'var(--primary)',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              🔥 Featured Story
            </span>

            <h1>
              {story.title}
              <br />
              <span>Discover</span>
            </h1>

            <div className="meta">
              <span>By {story.author || 'Unknown'}</span>
              <span>•</span>
              <span>{story.category}</span>
              <span>•</span>
              <span className="rating">⭐ {story.rating || '4.5'}</span>
              <span>•</span>
              <span>{story.totalReaders || 0} reads</span>
            </div>

            <p className="description">
              {story.description || 'A captivating story waiting to be discovered.'}
            </p>

            <div className="actions">
              <Link to={`/stories/${story.id}`} className="btn-primary btn-lg">
                📖 Read Now
              </Link>
              <button className="btn-secondary btn-lg">
                🔖 Save
              </button>
              <button className="btn-outline btn-lg">
                📤 Share
              </button>
            </div>
          </motion.div>

          <motion.div
            className="hero-cover"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="cover" style={{
              background: `linear-gradient(135deg, var(--primary), var(--accent))`,
            }}>
              <span style={{ fontSize: '80px' }}>{coverEmoji}</span>
              <span className="badge">{story.category}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;