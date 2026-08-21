import React from 'react';
import { Link } from 'react-router-dom';
import { ReadIcon, CheckIcon } from '../icons';

const ChapterList = ({ chapters, storyId, currentChapterId }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#808080' }}>
        No chapters available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {chapters.map((chapter) => {
        const isActive = chapter.id === currentChapterId;
        const isCompleted = chapter.chapterNumber < (currentChapterId || 0);
        
        return (
          <Link
            key={chapter.id}
            to={`/reader/${storyId}/${chapter.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              background: isActive ? 'rgba(229, 9, 20, 0.08)' : '#1A1A1A',
              borderRadius: '8px',
              border: isActive ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#2A2A2A';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#1A1A1A';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }
            }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isActive ? '#E50914' : '#2A2A2A',
                color: isActive ? 'white' : '#808080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                marginRight: '14px',
                flexShrink: 0,
              }}>
                {isCompleted ? <CheckIcon size={16} color="#22C55E" /> : chapter.chapterNumber}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px',
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : '#ffffff',
                  }}>
                    {chapter.title}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#808080',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <ReadIcon size={12} color="#808080" />
                    {chapter.readingTime || '5 min'}
                  </span>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#808080',
                  marginTop: '2px',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {chapter.content?.slice(0, 80)}...
                </div>
              </div>
              
              <div style={{
                marginLeft: '12px',
                color: isActive ? '#E50914' : '#808080',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                whiteSpace: 'nowrap',
              }}>
                {isActive ? 'Continue →' : isCompleted ? 'Completed ✓' : 'Read →'}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChapterList;