import { useState } from 'react';
import { Link } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Data Structures Notes', subject: 'Data Structures', date: '7/14/2026', type: 'PDF' },
    { id: 2, title: 'Algorithm Analysis', subject: 'Algorithms', date: '7/13/2026', type: 'PDF' },
    { id: 3, title: 'SQL Cheatsheet', subject: 'Database Systems', date: '7/12/2026', type: 'Image' },
  ]);

  const [showUpload, setShowUpload] = useState(false);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          📝 Unlimited Notes
        </h1>
        <p style={{ color: '#64748b' }}>
          Upload, organize, and access your study notes anytime
        </p>
      </div>

      {/* Upload Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary"
        >
          {showUpload ? '✕ Close' : '+ Upload New Note'}
        </button>

        {showUpload && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
              <p style={{ color: '#64748b' }}>Drag and drop your files here, or click to browse</p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Supports: PDF, Images, Audio</p>
              <button className="btn-primary" style={{ marginTop: '12px' }}>
                Choose Files
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
      }}>
        {notes.map(note => (
          <div key={note.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '28px' }}>{note.type === 'PDF' ? '📄' : '🖼️'}</span>
              <span className="badge badge-blue">{note.subject}</span>
            </div>
            <h4 style={{ fontWeight: '600', marginTop: '12px' }}>{note.title}</h4>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>📅 {note.date}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button className="btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                View
              </button>
              <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>
                Download
              </button>
              <button className="btn-danger" style={{ padding: '4px 12px', fontSize: '12px' }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;