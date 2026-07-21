import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      verifyPayment(reference);
    } else {
      setStatus('error');
      setMessage('No payment reference found');
    }
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      const response = await api.get(`/payments/verify/${reference}`);
      if (response.data.success) {
        setStatus('success');
        if (response.data.alreadyProcessed) {
          setMessage('Payment already confirmed! You are enrolled in the course.');
        } else {
          setMessage('Payment successful! You are now enrolled in the course!');
        }
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      // If unauthorized, user needs to log in again
      if (error.response?.status === 401) {
        setStatus('error');
        setMessage('Session expired. Please log in again to verify your enrollment.');
      } else {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify payment');
      }
    }
  };

  return (
    <div style={{ 
      padding: '60px 24px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        width: '100%'
      }}>
        {status === 'verifying' && (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Verifying your payment...
            </h2>
            <p style={{ color: '#64748b' }}>Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#065f46', marginBottom: '8px' }}>
              Payment Successful! 🎉
            </h2>
            <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>
              {message}
            </p>
            <Link 
              to="/dashboard" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 32px',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4338ca'}
              onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h12M9 6l-6 6 6 6"/>
                <path d="M21 12h-6"/>
              </svg>
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#991b1b', marginBottom: '8px' }}>
              Payment Failed
            </h2>
            <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>
              {message}
            </p>
            <Link 
              to="/courses" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 32px',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4338ca'}
              onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;