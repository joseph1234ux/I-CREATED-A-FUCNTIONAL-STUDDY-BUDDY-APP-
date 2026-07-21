import { useState } from 'react';

const StudySession = () => {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [sessionType, setSessionType] = useState('study');
  const [showForm, setShowForm] = useState(false);

  const subjects = [
    'Data Structures',
    'Algorithms',
    'Software Engineering',
    'Database Systems',
    'Web Development',
    'Machine Learning',
    'Computer Networks',
    'Operating Systems',
  ];

  const sessionTypes = [
    { value: 'study', label: '📖 Study - Learning new concepts' },
    { value: 'review', label: '🔄 Review - Reinforcing knowledge' },
    { value: 'practice', label: '💻 Practice - Solving problems' },
    { value: 'exam', label: '📝 Exam Prep - JAMB/WAEC ready' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subject) return;
    
    const newSession = {
      id: Date.now(),
      title,
      subject,
      type: sessionType,
      date: new Date().toLocaleDateString(),
      completed: false,
    };
    
    setSessions([newSession, ...sessions]);
    setTitle('');
    setSubject('');
    setSessionType('study');
    setShowForm(false);
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const toggleComplete = (id) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>📚 Study Sessions</h3>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Track your study progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ padding: '6px 16px', fontSize: '13px' }}
        >
          {showForm ? '✕' : '+ New'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Session title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                className="input-field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '14px', flex: '1' }}
                required
              >
                <option value="">Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="input-field"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '14px', flex: '1' }}
              >
                {sessionTypes.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '8px' }}>
              Start Session
            </button>
          </form>
        </div>
      )}

      {sessions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #e2e8f0',
        }}>
          <p style={{ color: '#64748b', fontSize: '14px' }}>No sessions yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {sessions.map(session => (
            <div
              key={session.id}
              style={{
                background: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: session.completed ? 0.6 : 1,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{session.title}</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px', padding: '2px 8px' }}>{session.subject}</span>
                  <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 8px' }}>{session.type}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>📅 {session.date}</p>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => toggleComplete(session.id)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  {session.completed ? '✅' : '⬜'}
                </button>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="btn-danger"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySession;