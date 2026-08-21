import React from 'react';

const palettes = [
  ['#40203f', '#d95c8a'], ['#17223b', '#7762d7'], ['#162f31', '#5ba58f'],
  ['#392516', '#cc8750'], ['#2e1d35', '#a36ec2'], ['#1e2a25', '#849c63'],
];

const BookCover = ({ title = 'Untitled Story', id = 0, author = 'StoryTeller', className = '' }) => {
  const [base, accent] = palettes[Math.abs(Number(id) || 0) % palettes.length];
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <div className={`book-cover book-cover-art ${className}`} style={{ '--cover-base': base, '--cover-accent': accent }}>
      <div className="book-cover-grain" />
      <span className="book-cover-kicker">StoryTeller Edition</span>
      <div className="book-cover-orbit" />
      <h3>{words.slice(0, 5).join(' ')}</h3>
      <span className="book-cover-rule" />
      <p>{author}</p>
    </div>
  );
};

export default BookCover;
