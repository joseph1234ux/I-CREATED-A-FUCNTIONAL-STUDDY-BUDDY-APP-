import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminStudio = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    status: 'Ongoing',
  });
  const [storyId, setStoryId] = useState('');
  const [chapter, setChapter] = useState({
    title: '',
    chapterNumber: 1,
    content: '',
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.email !== 'admin@storyteller.com') {
        alert('Only admin can access this page.');
        navigate('/');
      }
    } else {
      navigate('/login');
    }
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/stories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      let all = [];
      if (res.data && res.data.stories) all = res.data.stories;
      else if (Array.isArray(res.data)) all = res.data;
      setStories(all);
      setMessage(all.length === 0 ? 'No stories yet. Create one below!' : '');
    } catch (error) {
      console.error('Error fetching stories:', error);
      setMessage('Failed to load stories. Check backend.');
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/stories', {
        ...newStory,
        isPublished: true,   // <--- THIS FIXES IT
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Story created! Now add chapters below.');
      setNewStory({ title: '', author: '', category: '', description: '', status: 'Ongoing' });
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('❌ Failed to create story.');
    }
    setLoading(false);
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!storyId) {
      alert('Please select a story from the dropdown.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/stories/${storyId}/chapters`, chapter, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Chapter added!');
      setChapter({ title: '', chapterNumber: 1, content: '' });
      fetchStories();
    } catch (error) {
      console.error('Error adding chapter:', error);
      alert('❌ Failed to add chapter.');
    }
    setLoading(false);
  };

  if (!user) return <div style={{ paddingTop: '100px', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ color: '#E50914' }}>📝 Admin Studio</h1>
      <p>Logged in as {user.email}</p>
      {message && <p style={{ color: '#FBBF24' }}>{message}</p>}

      <hr style={{ borderColor: '#333' }} />

      <h2>📖 Create New Story</h2>
      <form onSubmit={handleCreateStory}>
        <input
          type="text"
          placeholder="Title *"
          value={newStory.title}
          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Author *"
          value={newStory.author}
          onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Genre (e.g., Drama, Fantasy) *"
          value={newStory.category}
          onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={newStory.description}
          onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
          rows="3"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <select
          value={newStory.status}
          onChange={(e) => setNewStory({ ...newStory, status: e.target.value })}
          style={inputStyle}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Creating...' : 'Create Story'}
        </button>
      </form>

      <hr style={{ borderColor: '#333' }} />

      <h2>📄 Add Chapter</h2>
      <p style={{ color: '#808080', fontSize: '14px' }}>
        {stories.length === 0
          ? '👆 Create a story first, then it will appear here.'
          : `Select a story from the dropdown (${stories.length} available)`}
      </p>
      <form onSubmit={handleAddChapter}>
        <select
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="">-- Select a story --</option>
          {stories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} (ID: {s.id}) – Chapters: {s.chapters?.length || 0}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Chapter Title *"
          value={chapter.title}
          onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Chapter Number *"
          value={chapter.chapterNumber}
          onChange={(e) => setChapter({ ...chapter, chapterNumber: parseInt(e.target.value) || 1 })}
          required
          min="1"
          style={inputStyle}
        />
        <textarea
          placeholder="Chapter Content *"
          value={chapter.content}
          onChange={(e) => setChapter({ ...chapter, content: e.target.value })}
          rows="6"
          required
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Adding...' : 'Add Chapter'}
        </button>
      </form>

      <hr style={{ borderColor: '#333' }} />

      <h3>📚 Existing Stories ({stories.length})</h3>
      {stories.length === 0 ? (
        <p style={{ color: '#808080' }}>No stories yet. Create one above!</p>
      ) : (
        <ul>
          {stories.map((s) => (
            <li key={s.id} style={{ marginBottom: '8px' }}>
              <strong>{s.title}</strong> by {s.author} – {s.category} ({s.status}) – Chapters: {s.chapters?.length || 0}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  background: '#1F1F1F',
  border: '1px solid #333',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
};

const buttonStyle = {
  background: '#E50914',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px',
};

export default AdminStudio;