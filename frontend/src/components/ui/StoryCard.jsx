import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookCover from './BookCover';
import * as Icons from '../icons/index.jsx';

const StoryCard = ({ story, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  if (!story) return null;

  const status = story.status || (Math.random() > 0.5 ? 'Completed' : 'Ongoing');

  return (
    <motion.div
      className="story-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.05, y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/stories/${story.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="story-card-cover">
          <BookCover 
            title={story.title} 
            id={story.id} 
            author={story.author}
          />
          <span className={`story-card-status ${status === 'Completed' ? 'completed' : 'ongoing'}`}>
            {status}
          </span>
          {story.rating > 4.5 && (
            <span className="story-card-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icons.StarIcon size={12} color="white" /> Featured
            </span>
          )}
          <button
            className="story-card-bookmark"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <Icons.BookmarkIcon size={18} color={isBookmarked ? '#E50914' : '#B3B3B3'} />
          </button>
          
          {isHovered && (
            <div className="story-card-hover">
              <button className="story-card-read-btn">Read Now</button>
            </div>
          )}
        </div>
        <div className="story-card-content">
          <h3 className="story-card-title">{story.title}</h3>
          <p className="story-card-author">by {story.author || 'Unknown'}</p>
          <div className="story-card-meta">
            <span className="story-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icons.StarIcon size={14} color="#FBBF24" />
              {story.rating || '4.5'}
            </span>
            <span className="story-card-reads" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icons.ReadIcon size={14} color="#808080" />
              {story.totalReaders || 0}
            </span>
          </div>
          <span className="story-card-tag">{story.category || 'General'}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default StoryCard;