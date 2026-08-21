import React from 'react';
import { Link } from 'react-router-dom';

const SectionRow = ({ title, children, viewAllLink = '/stories' }) => {
  return (
    <div className="genre-section">
      <div className="genre-header">
        <h2 className="genre-title">{title}</h2>
        <Link to={viewAllLink} className="genre-view-all">
          View All →
        </Link>
      </div>
      <div className="horizontal-scroll">
        {children}
      </div>
    </div>
  );
};

export default SectionRow;