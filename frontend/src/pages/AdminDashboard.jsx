import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { const user = JSON.parse(localStorage.getItem('user') || 'null'); if (user?.role !== 'ADMIN') return navigate('/', { replace: true }); api.get('/stories/admin/summary').then(({ data: result }) => setData(result)).catch((requestError) => { if (requestError.response?.status === 403) navigate('/', { replace: true }); else setError('Unable to load publishing data.'); }); }, [navigate]);
  if (!data && !error) return <main className="admin-shell">Loading publishing workspace…</main>;
  const stats = data && [['Total Stories',data.stories],['Total Poems',data.poems],['Total Chapters',data.chapters],['Total Readers',data.readers],['Total Reads',data.reads]];
  return <main className="admin-shell"><header className="admin-header"><div><p className="admin-eyebrow">StoryTeller Studio</p><h1>Publishing dashboard</h1><p>Official content and editorial workflow.</p></div><div className="admin-actions"><Link to="/add-story">+ New Story</Link><Link to="/add-story?type=poem">+ New Poem</Link></div></header>{error && <p>{error}</p>}{data && <><section className="admin-stats">{stats.map(([label,value])=><div key={label}><span>{label}</span><strong>{Number(value).toLocaleString()}</strong></div>)}</section><section className="admin-grid"><div className="admin-panel"><h2>Recently published</h2>{data.recent.map((story)=><Link className="admin-story-row" to={`/edit-story/${story.id}`} key={story.id}><span><strong>{story.title}</strong><small>{story.author} · {story.category}</small></span><em className={story.isPublished?'published':'draft'}>{story.isPublished?'Published':'Draft'}</em></Link>)}</div><aside className="admin-panel"><h2>Workspace</h2><p>{data.drafts} drafts awaiting review.</p><Link to="/stories">Stories</Link><Link to="/poems">Poems</Link><Link to="/add-story">Chapters</Link><Link to="/profile">Settings</Link></aside></section></>}</main>;
}
