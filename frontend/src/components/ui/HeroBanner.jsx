import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import api from '../../api/axios';

export default function HeroBanner() {
  const [stories,setStories]=useState([]),[index,setIndex]=useState(0),[paused,setPaused]=useState(false); const touch=useRef(null);
  useEffect(()=>{api.get('/stories/featured/list').then(({data})=>setStories(data.stories||[]));},[]);
  useEffect(()=>{if(paused||stories.length<2)return;const timer=setInterval(()=>setIndex(i=>(i+1)%stories.length),6000);return()=>clearInterval(timer);},[paused,stories.length]);
  useEffect(()=>{const keys=e=>{if(stories.length<2)return;if(e.key==='ArrowRight')setIndex(i=>(i+1)%stories.length);if(e.key==='ArrowLeft')setIndex(i=>(i-1+stories.length)%stories.length);};window.addEventListener('keydown',keys);return()=>window.removeEventListener('keydown',keys);},[stories.length]);
  if(!stories.length)return null; const story=stories[index], move=(step)=>setIndex(i=>(i+step+stories.length)%stories.length);
  return <section className="hero-carousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current-e.changedTouches[0].clientX>40)move(1);if(e.changedTouches[0].clientX-touch.current>40)move(-1);}}><div className="hero-carousel-glow"/><div className="hero-carousel-copy"><span className="hero-badge">Featured story</span><h1>{story.title}</h1><p className="hero-carousel-meta">{story.author} · {story.category} · ★ {story.rating || '4.5'}</p><p>{story.description || 'A story waiting to be discovered.'}</p><div className="hero-actions"><Link className="btn-netflix-red" to={`/reader/${story.id}`}>Read now</Link><Link className="btn-netflix-secondary" to={`/stories/${story.id}`}>View details</Link></div><div className="hero-dots">{stories.map((item,i)=><button key={item.id} aria-label={`Go to ${item.title}`} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div></div><div className="hero-carousel-cover"><BookCover title={story.title} id={story.id} author={story.author}/></div><button className="hero-arrow hero-prev" aria-label="Previous feature" onClick={()=>move(-1)}>‹</button><button className="hero-arrow hero-next" aria-label="Next feature" onClick={()=>move(1)}>›</button></section>;
}
