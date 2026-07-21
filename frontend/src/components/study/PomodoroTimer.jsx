import { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleSessionComplete();
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
  }, [isRunning, minutes, seconds]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (sessionType === 'focus') {
      setSessionsCompleted(sessionsCompleted + 1);
      alert('🎉 Focus session complete! Time for a break.');
      setSessionType('shortBreak');
      setMinutes(5);
      setSeconds(0);
    } else {
      alert('☕ Break complete! Ready to focus?');
      setSessionType('focus');
      setMinutes(25);
      setSeconds(0);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(sessionType === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const formatTime = (m, s) => {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
        {sessionType === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
        {sessionType === 'focus' ? 'Stay focused and productive' : 'Relax and recharge'}
      </p>

      <div style={{
        fontSize: '56px',
        fontWeight: '800',
        color: sessionType === 'focus' ? '#4f46e5' : '#22c55e',
        fontFamily: 'monospace',
        marginBottom: '16px',
      }}>
        {formatTime(minutes, seconds)}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '12px',
      }}>
        <button
          onClick={startTimer}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '14px' }}
          disabled={isRunning}
        >
          ▶ Start
        </button>
        <button
          onClick={pauseTimer}
          className="btn-secondary"
          style={{ padding: '8px 20px', fontSize: '14px' }}
          disabled={!isRunning}
        >
          ⏸ Pause
        </button>
        <button
          onClick={resetTimer}
          className="btn-secondary"
          style={{ padding: '8px 20px', fontSize: '14px' }}
        >
          🔄 Reset
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
      }}>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Sessions: <strong>{sessionsCompleted}</strong>
        </span>
        <span style={{
          padding: '2px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '600',
          background: sessionType === 'focus' ? '#eef2ff' : '#d1fae5',
          color: sessionType === 'focus' ? '#4f46e5' : '#065f46',
        }}>
          {sessionType === 'focus' ? 'Focus' : 'Break'}
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;