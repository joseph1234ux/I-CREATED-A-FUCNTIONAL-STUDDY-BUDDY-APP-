import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAIResponse } from './services/aiService';

const AITutor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! 👋 I'm your AI Study Assistant. I can help you with Computer Science concepts, problem-solving, and exam preparation. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(userInput);
      
      const responseMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse
      };
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    'Explain Data Structures',
    'What is an Algorithm?',
    'How does SQL work?',
    'Explain OOP concepts',
    'What is a Database?',
    'How to prepare for JAMB?'
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ color: '#4f46e5', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
          🤖 AI Study Assistant
        </h1>
        <p style={{ color: '#64748b' }}>
          Your personal AI tutor for Computer Science, tailored for Nigerian curriculum
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#0f172a',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.target.style.background = '#f1f5f9'; }}
          >
            {q}
          </button>
        ))}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        height: '450px',
        overflowY: 'auto',
        marginBottom: '16px',
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.sender === 'user' ? '#4f46e5' : '#f1f5f9',
              color: msg.sender === 'user' ? 'white' : '#0f172a',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#f1f5f9',
              color: '#0f172a',
            }}>
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Ask me anything about Computer Science..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="btn-primary"
          disabled={!input.trim() || isTyping}
        >
          {isTyping ? 'Thinking...' : 'Send'}
        </button>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#eef2ff',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#4f46e5',
        textAlign: 'center',
      }}>
        💡 Powered by AI • Works in Nigeria 🇳🇬 • Free and fast!
      </div>
    </div>
  );
};

export default AITutor;