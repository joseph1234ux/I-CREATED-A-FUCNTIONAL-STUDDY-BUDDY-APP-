import React from 'react';

const StoryCardSkeleton = () => {
  return (
    <div className="skeleton-card-grid">
      <div className="skeleton-cover" />
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  );
};

export default StoryCardSkeleton;