import { useState } from 'react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 28 }) => {
  const [hovered, setHovered] = useState(0);


  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) setHovered(value);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHovered(0);
  };

  const displayRating = hovered || rating || 0;

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            fontSize: size,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= displayRating ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.2s ease',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;