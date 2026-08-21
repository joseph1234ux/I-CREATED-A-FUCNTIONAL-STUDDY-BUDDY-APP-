import React from 'react';
import { Link } from 'react-router-dom';
import StoryCard from '../ui/StoryCard';

const StoryRow = ({ title, stories, delay = 0 }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="story-row">
      <div className="story-row-header">
        <h2>{title} <span>✦</span></h2>
        <Link to="/stories" className="view-all">
          View All →
        </Link>
      </div>

      <div className="story-scroll">
        {stories.slice(0, 6).map((story, index) => (
          <StoryCard key={story.id} story={story} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StoryRow;