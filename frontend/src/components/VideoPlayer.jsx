import { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ videoUrl, title, isCompleted, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-play when video is loaded
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.focus();
    }
  }, [videoUrl]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Listen for video events from YouTube iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'ended') {
        handleVideoEnd();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        background: '#0f172a',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '4px',
      }}
    >
      {/* Video Player */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          ref={playerRef}
          src={`${videoUrl}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Video Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#1e293b',
          borderTop: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Play/Pause Button */}
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              background: '#4f46e5',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#4338ca'}
            onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Title */}
          <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>
            {title}
          </span>
        </div>

        {/* Complete Button */}
        {!isCompleted && (
          <button
            onClick={onComplete}
            style={{
              background: '#10b981',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => e.target.style.background = '#059669'}
            onMouseLeave={(e) => e.target.style.background = '#10b981'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Mark Complete
          </button>
        )}

        {isCompleted && (
          <span style={{
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed ✅
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;