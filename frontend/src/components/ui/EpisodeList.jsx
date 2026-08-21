import React from 'react';

const EpisodeList = ({ episodes, title }) => {
  if (!episodes || episodes.length === 0) return null;

  return (
    <div className="episode-list-wrapper">
      <h3 className="episode-list-title">{title || 'Episodes'}</h3>
      <div className="episode-list">
        {episodes.map((episode, index) => (
          <div key={index} className="episode-item">
            <div className="episode-info">
              <span className="episode-title">{episode.title}</span>
              <span className="episode-date">{episode.date}</span>
            </div>
            <button className="episode-read-btn">Read</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;