import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FocusMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setSessionCount(prev => prev + 1);
            alert('🎉 Focus session complete! Great job!');
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const startFocus = () => setIsActive(true);
  const pauseFocus = () => setIsActive(false);
  const resetFocus = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const formatTime = (m, s) => {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div style={{
      padding: '40px 24px',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          🎯 Focus Mode
        </h1>
        <p style={{ color: '#64748b' }}>
          Enter deep focus and boost your productivity
        </p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{
          fontSize: '72px',
          fontWeight: '800',
          color: isActive ? '#4f46e5' : '#0f172a',
          fontFamily: 'monospace',
          marginBottom: '24px',
        }}>
          {formatTime(minutes, seconds)}
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}>
          <button
            onClick={startFocus}
            className="btn-primary"
            style={{ padding: '12px 32px' }}
            disabled={isActive}
          >
            🚀 Start Focus
          </button>
          <button
            onClick={pauseFocus}
            className="btn-secondary"
            style={{ padding: '12px 32px' }}
            disabled={!isActive}
          >
            ⏸ Pause
          </button>
          <button
            onClick={resetFocus}
            className="btn-secondary"
            style={{ padding: '12px 32px' }}
          >
            🔄 Reset
          </button>
        </div>

        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>
                {sessionCount}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Sessions</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5' }}>
                {sessionCount * 25}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Minutes Focused</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;