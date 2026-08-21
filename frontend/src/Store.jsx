import React, { useState } from 'react';

const Store = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '$9.99', features: ['Unlimited reading', 'Download books', 'Premium content', 'No ads'] },
    { id: 'yearly', name: 'Yearly', price: '$79.99', features: ['All monthly features', '2 months free', 'Exclusive content', 'Early access'] },
    { id: 'lifetime', name: 'Lifetime', price: '$199.99', features: ['All features forever', 'Lifetime access', 'Premium support', 'Special badge'] },
  ];

  const books = [
    { id: 1, title: 'The Last Summer', author: 'Emma Hart', price: '$14.99', cover: '📖' },
    { id: 2, title: 'Before I Forget', author: 'Nina Torres', price: '$12.99', cover: '📕' },
    { id: 3, title: 'The 30-Day Challenge', author: 'Dr. Maya Collins', price: '$16.99', cover: '📗' },
    { id: 4, title: 'The Mirror\'s Secret', author: 'James Hunter', price: '$11.99', cover: '📘' },
    { id: 5, title: 'The Accidental Roommate', author: 'Max Brooks', price: '$13.99', cover: '📙' },
    { id: 6, title: 'The Year I Found Myself', author: 'Lucy Rose', price: '$10.99', cover: '📓' },
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="container-full">
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>🏪 Store</h1>
        <p style={{ color: '#808080', marginBottom: '32px' }}>
          Discover premium books and exclusive content
        </p>

        {/* Subscription Plans */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>📦 Subscription Plans</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                background: selectedPlan === plan.id ? '#1F1F1F' : '#141414',
                borderRadius: '12px',
                padding: '24px',
                border: selectedPlan === plan.id ? '2px solid #E50914' : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedPlan(plan.id)}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E50914'}
              onMouseLeave={(e) => {
                if (selectedPlan !== plan.id) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }
              }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#E50914', marginBottom: '16px' }}>
                  {plan.price}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ color: '#B3B3B3', padding: '4px 0', fontSize: '14px' }}>
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
                <button style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: selectedPlan === plan.id ? '#E50914' : '#2A2A2A',
                  color: selectedPlan === plan.id ? '#ffffff' : '#B3B3B3',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedPlan === plan.id) {
                    e.currentTarget.style.background = '#F40612';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPlan === plan.id) {
                    e.currentTarget.style.background = '#E50914';
                  }
                }}
                >
                  {selectedPlan === plan.id ? 'Subscribe Now' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Books for Sale */}
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>📚 Books for Sale</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            {books.map((book) => (
              <div key={book.id} style={{
                background: '#1F1F1F',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#E50914';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{book.cover}</div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>{book.title}</h4>
                <p style={{ fontSize: '13px', color: '#808080', marginBottom: '8px' }}>{book.author}</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#E50914', marginBottom: '12px' }}>
                  {book.price}
                </p>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: '#E50914',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F40612'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#E50914'}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;