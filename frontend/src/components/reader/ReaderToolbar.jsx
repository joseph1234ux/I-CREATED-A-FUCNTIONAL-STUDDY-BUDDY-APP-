import React from 'react';

const ReaderToolbar = ({
  storyTitle,
  progress,
  onBack,
  onToggleTOC,
  onToggleSettings,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  return (
    <div className="reader-toolbar">
      <div className="left">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <span className="book-title">{storyTitle}</span>
      </div>

      <div className="right">
        <button onClick={onPrev} disabled={!hasPrev} title="Previous Chapter">
          ◀
        </button>
        <button onClick={onNext} disabled={!hasNext} title="Next Chapter">
          ▶
        </button>
        <button onClick={onToggleTOC} title="Table of Contents">
          📑
        </button>
        <button onClick={onToggleSettings} title="Reader Settings">
          ⚙️
        </button>
        <div className="progress-bar">
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ fontSize: '12px', color: '#8B8B8B' }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ReaderToolbar;