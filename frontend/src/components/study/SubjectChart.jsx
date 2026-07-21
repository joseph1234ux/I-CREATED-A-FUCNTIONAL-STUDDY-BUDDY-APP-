import { useState, useEffect } from 'react';

const SubjectChart = () => {
  const [subjects, setSubjects] = useState([
    { name: 'Data Structures', hours: 30, color: '#4f46e5' },
    { name: 'Algorithms', hours: 25, color: '#7c3aed' },
    { name: 'Software Engineering', hours: 20, color: '#ec4899' },
    { name: 'Database Systems', hours: 15, color: '#f59e0b' },
    { name: 'Web Development', hours: 10, color: '#10b981' },
  ]);

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
        📊 Subject Study Distribution
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
        Total: {totalHours} hours studied
      </p>

      {/* Bar Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {subjects.map((subject, index) => {
          const percentage = (subject.hours / totalHours) * 100;
          return (
            <div key={index}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {subject.name}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  {subject.hours}h ({Math.round(percentage)}%)
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: subject.color,
                  borderRadius: '4px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectChart;