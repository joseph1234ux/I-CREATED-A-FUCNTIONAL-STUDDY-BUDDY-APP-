import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PoemsIcon, HeartIcon, ReadIcon, SearchIcon } from '../components/icons';

const Poems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchPoems = async () => {
      setLoading(true);
      setError('');

      try {
        // Query Poetry at the API so pagination of ordinary stories cannot hide poems.
        const response = await api.get('/stories', {
          params: { genre: 'Poetry', limit: 100, sort: 'az' },
        });
        const stories = Array.isArray(response.data?.stories)
          ? response.data.stories
          : Array.isArray(response.data)
            ? response.data
            : [];

        if (isMounted) setPoems(stories);
      } catch (requestError) {
        if (isMounted) {
          setPoems([]);
          setError(
            requestError.code === 'ERR_NETWORK'
              ? 'The StoryTeller server is unavailable. Start the backend and try again.'
              : 'Poems could not be loaded. Please try again.',
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPoems();
    return () => { isMounted = false; };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = poems.filter((poem) =>
    poem.title?.toLowerCase().includes(normalizedSearch)
    || poem.author?.toLowerCase().includes(normalizedSearch),
  );

  if (loading) {
    return <div style={{ paddingTop: '100px', textAlign: 'center', color: '#808080' }}>Loading poems...</div>;
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="container-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PoemsIcon size={32} color="#E50914" /> Poems
            </h1>
            <p style={{ color: '#808080' }}>{filtered.length} classic poems</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1F1F1F', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <SearchIcon size={18} color="#808080" />
            <input type="text" placeholder="Search poems..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '4px 8px', minWidth: '180px' }} />
          </div>
        </div>

        {error && <p style={{ color: '#F87171', marginTop: '24px' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
          {filtered.map((poem) => (
            <Link to={`/stories/${poem.id}`} key={poem.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%' }} onMouseEnter={(event) => { event.currentTarget.style.transform = 'translateY(-4px)'; event.currentTarget.style.borderColor = '#E50914'; }} onMouseLeave={(event) => { event.currentTarget.style.transform = 'translateY(0)'; event.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #E50914, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white' }}>{poem.author?.[0] || 'P'}</div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>{poem.author || 'Unknown'}</h4>
                    <p style={{ fontSize: '12px', color: '#808080' }}>{poem.publishedYear || 'Classic'} • Poetry</p>
                  </div>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>{poem.title}</h3>
                <p style={{ fontSize: '14px', color: '#B3B3B3', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{poem.description || 'A classic poem.'}</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', borderLeft: '2px solid #E50914' }}>
                  <p style={{ fontSize: '13px', color: '#808080', lineHeight: '1.6', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>“{poem.content?.slice(0, 120) || poem.description}”</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#808080' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartIcon size={14} color="#EF4444" /> {poem.likes || 0}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ReadIcon size={14} color="#808080" /> {poem.totalReaders || 0}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#E50914', fontWeight: '600' }}>Read Poem →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!error && filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#808080' }}><PoemsIcon size={48} color="#808080" /><h3 style={{ marginTop: '16px', color: '#ffffff' }}>No poems found</h3><p>Try adjusting your search.</p></div>}
      </div>
    </div>
  );
};

export default Poems;
