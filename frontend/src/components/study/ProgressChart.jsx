import { useState } from 'react';

const ProgressChart = () => {
  const [weeklyData] = useState([
    { week: 'Week 1', hours: 8 },
    { week: 'Week 2', hours: 12 },
    { week: 'Week 3', hours: 15 },
    { week: 'Week 4', hours: 20 },
    { week: 'Week 5', hours: 18 },
    { week: 'Week 6', hours: 25 },
  ]);

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
        📈 Study Time Progress
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
        Consistent growth in study time 📈 Always up the academic year!
      </p>

      {/* Bar Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '180px',
        gap: '8px',
        paddingBottom: '24px',
      }}>
        {weeklyData.map((data, index) => {
          const height = (data.hours / maxHours) * 100;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '40px',
                  height: `${height}%`,
                  background: 'linear-gradient(180deg, #4f46e5, #818cf8)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.6s ease',
                  minHeight: '4px',
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#64748b',
                marginTop: '6px',
                textAlign: 'center',
              }}>
                {data.week}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        fontSize: '13px',
        color: '#64748b',
      }}>
        <span>⬆️ {weeklyData[weeklyData.length - 1].hours}h this week</span>
        <span>📈 +{weeklyData[weeklyData.length - 1].hours - weeklyData[0].hours}h growth</span>
      </div>
    </div>
  );
};

export default ProgressChart;