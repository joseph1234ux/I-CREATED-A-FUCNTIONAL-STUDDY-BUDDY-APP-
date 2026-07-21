import { Link } from 'react-router-dom';

const JAMBPrep = () => {
  const subjects = [
    { name: 'Mathematics', progress: 75, questions: 120 },
    { name: 'English', progress: 60, questions: 90 },
    { name: 'Physics', progress: 45, questions: 75 },
    { name: 'Chemistry', progress: 30, questions: 60 },
    { name: 'Biology', progress: 20, questions: 45 },
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          🏆 JAMB/WAEC Prep
        </h1>
        <p style={{ color: '#64748b' }}>
          Practice and prepare for your exams with AI-powered questions
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>85%</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Overall Score</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>150</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Questions Solved</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>12</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Practice Tests</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#4f46e5' }}>3</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Mock Exams</div>
        </div>
      </div>

      {/* Subjects */}
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
        📚 Subjects
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {subjects.map((subj, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h4 style={{ fontWeight: '600' }}>{subj.name}</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{subj.questions} questions</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '120px' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${subj.progress}%` }} />
                </div>
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{subj.progress}%</span>
              <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>
                Practice
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button className="btn-primary" style={{ padding: '10px 24px' }}>
          🎯 Start Practice Test
        </button>
        <button className="btn-secondary" style={{ padding: '10px 24px' }}>
          📊 View Analytics
        </button>
      </div>
    </div>
  );
};

export default JAMBPrep;