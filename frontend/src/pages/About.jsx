const About = () => {
  return (
    <div style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: '#eef2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <path d="M9 9h6"/>
              <path d="M9 13h4"/>
            </svg>
          </div>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
          About StudyBuddy
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>
          Empowering learners worldwide with quality education
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Our Mission
        </h3>
        <p style={{ color: '#475569', lineHeight: '1.8' }}>
          StudyBuddy is on a mission to make quality education accessible to everyone, everywhere. 
          We believe that learning should be engaging, affordable, and tailored to each individual's needs. 
          Our platform connects students with expert instructors and provides interactive, practical learning experiences.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid-4">
        {[
          { 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="13" x2="13" y2="13"/>
              </svg>
            ),
            value: '50+',
            label: 'Courses',
            bg: '#eef2ff'
          },
          { 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
            value: '10K+',
            label: 'Students',
            bg: '#f3e8ff'
          },
          { 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
                <path d="M12 12v5"/>
              </svg>
            ),
            value: '100+',
            label: 'Instructors',
            bg: '#fef3c7'
          },
          { 
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ),
            value: '95%',
            label: 'Completion',
            bg: '#d1fae5'
          }
        ].map((item, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: item.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              {item.icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
              {item.value}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;