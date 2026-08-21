import React from 'react';

const TableOfContents = ({ isOpen, chapters, currentIndex, onSelect, onClose }) => {
  return (
    <div className={`toc-sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="toc-title">📑 Table of Contents</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <div>
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={`toc-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span>{chapter.title}</span>
            <span className="chapter-num">#{chapter.chapterNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;