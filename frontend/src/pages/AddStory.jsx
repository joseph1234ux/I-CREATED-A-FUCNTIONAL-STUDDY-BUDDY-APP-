import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Icon from '../components/common/Icon';

const AddStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Romance', 'Drama', 'Comedy', 'Life-Changing', 'Coming of Age', 'Thriller', 'Mystery', 'Sci-Fi', 'Fantasy', 'Horror'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/stories', formData);
      navigate('/stories');
    } catch (error) {
      setError('Failed to create story. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '120px 60px 60px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '32px', marginBottom: '8px' }}>
        Write a New Story
      </h1>
      <p style={{ color: '#7a6558', marginBottom: '32px' }}>
        Share your story with the world
      </p>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #dccfc4' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #dccfc4', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Author</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #dccfc4', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #dccfc4', borderRadius: '8px' }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '12px', border: '1px solid #dccfc4', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #dccfc4', borderRadius: '8px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2c1810',
            color: 'white',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Publishing...' : <><Icon name="book" size={18} /> Publish Story</>}
        </button>
      </form>
    </div>
  );
};

export default AddStory;
