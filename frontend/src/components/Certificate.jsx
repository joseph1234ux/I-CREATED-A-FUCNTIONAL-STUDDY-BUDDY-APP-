import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = ({ userName, courseTitle, date, onClose }) => {
  const certificateRef = useRef();

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate_${userName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Certificate Preview */}
        <div ref={certificateRef} style={{
          padding: '40px',
          background: 'white',
          border: '10px solid #4f46e5',
          borderRadius: '12px',
          textAlign: 'center',
          position: 'relative',
          minHeight: '400px',
        }}>
          {/* Decorative border */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            right: '15px',
            bottom: '15px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#4f46e5',
                  margin: 0,
                }}>StudyBuddy</h1>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0,
                }}>Certificate of Completion</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ margin: '30px 0' }}>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                marginBottom: '8px',
              }}>
                This certificate is proudly presented to
              </p>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '8px 0',
              }}>
                {userName}
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: '8px 0',
              }}>
                for successfully completing the course
              </p>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#4f46e5',
                margin: '8px 0',
              }}>
                {courseTitle}
              </h3>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '30px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
            }}>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0,
                }}>Date of Issue</p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: 0,
                }}>{date}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '120px',
                  height: '40px',
                  borderTop: '2px solid #0f172a',
                  margin: '0 auto',
                }} />
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0,
                }}>Authorized Signature</p>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0,
                }}>Certificate ID</p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: 0,
                }}>#SB-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center',
        }}>
          <button
            onClick={downloadCertificate}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 24px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 18 15 15"/>
            </svg>
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 24px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;