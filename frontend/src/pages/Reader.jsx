import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import '../styles/reader.css';

const buildFallbackChapters = (storyTitle) => {
  return Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    chapterNumber: index + 1,
    title: `Chapter ${index + 1}`,
    content: `In the hush of evening, ${storyTitle || 'the story'} unfolded with a quiet sense of wonder. Each paragraph pulled the reader a little deeper into the world, turning simple words into a lasting feeling of mystery, beauty, and anticipation.`,
  }));
};

const Reader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('readerTheme') || 'light');
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('readerFontSize')) || 18);
  const [lineHeight, setLineHeight] = useState(() => Number(localStorage.getItem('readerLineHeight')) || 1.9);
  const [readingWidth, setReadingWidth] = useState(() => Number(localStorage.getItem('readerWidth')) || 760);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/stories/${id}`);
        const storyData = data || {};
        const storyChapters = Array.isArray(storyData.chapters) && storyData.chapters.length > 0
          ? storyData.chapters
          : buildFallbackChapters(storyData.title);

        setStory(storyData);
        setChapters(storyChapters);
      } catch (error) {
        console.error('Error fetching story:', error);
        setStory(null);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  useEffect(() => {
    if (!chapters.length) return;

    const selectedIndex = chapterId
      ? chapters.findIndex((chapter) => String(chapter.id) === String(chapterId))
      : 0;

    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setCurrentIndex(nextIndex);
    setCurrentChapter(chapters[nextIndex] || null);
    setProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapters, chapterId]);

  useEffect(() => {
    localStorage.setItem('readerTheme', theme);
    localStorage.setItem('readerFontSize', String(fontSize));
    localStorage.setItem('readerLineHeight', String(lineHeight));
    localStorage.setItem('readerWidth', String(readingWidth));
  }, [theme, fontSize, lineHeight, readingWidth]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
      setProgress(nextProgress);
      if (story && currentChapter) localStorage.setItem(`reading-progress-${story.id}`, JSON.stringify({ storyId: story.id, storyTitle: story.title, chapterId: currentChapter.id, chapterTitle: currentChapter.title, progress: nextProgress, updatedAt: Date.now() }));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [currentChapter?.id]);

  const goToChapter = (index) => {
    if (index < 0 || index >= chapters.length) return;
    const nextChapter = chapters[index];
    setCurrentIndex(index);
    setCurrentChapter(nextChapter);
    navigate(`/reader/${id}/${nextChapter.id}`);
  };

  const paragraphs = useMemo(() => {
    if (!currentChapter?.content) return ['The story continues on the next page.'];

    return currentChapter.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [currentChapter]);

  if (loading) {
    return (
      <div className={`reader-shell reader-theme-${theme}`}>
        <div className="reader-loading">Loading story…</div>
      </div>
    );
  }

  if (!story || !currentChapter) {
    return (
      <div className={`reader-shell reader-theme-${theme}`}>
        <div className="reader-empty">
          <h2>Chapter not found</h2>
          <Link to={`/stories/${id}`}>← Back to story</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`reader-shell reader-theme-${theme}`}>
      <div className="reader-progress">
        <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="reader-toolbar">
        <div className="reader-toolbar-left">
          <button className="reader-toolbar-button" onClick={() => navigate(`/stories/${id}`)}>
            ← Back
          </button>
          <span className="reader-toolbar-title">{story.title}</span>
        </div>
        <div className="reader-toolbar-right">
          <button className="reader-toolbar-button" onClick={() => setBookmarked((value) => !value)}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
          <select className="reader-select" aria-label="Reading theme" value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="light">Light</option><option value="sepia">Sepia</option><option value="dark">Dark</option>
          </select>
          <button
            className="reader-toolbar-button"
            onClick={() => setTheme((current) => (current === 'light' ? 'sepia' : current === 'sepia' ? 'dark' : 'light'))}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="reader-progress-text">{progress}%</span>
        </div>
      </div>

      <div className="reader-settings" aria-label="Reader settings">
        <label>Text <input type="range" min="16" max="23" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label>
        <label>Spacing <input type="range" min="1.5" max="2.3" step="0.1" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} /></label>
        <label>Width <input type="range" min="620" max="900" step="20" value={readingWidth} onChange={(event) => setReadingWidth(Number(event.target.value))} /></label>
      </div>
      <div className="reader-paper" style={{ maxWidth: readingWidth }}>
        <div className="book-header">
          <div className="book-title">{story.title}</div>
          <div className="book-author">by {story.author}</div>
        </div>

        <div className="chapter-header">
          <div className="chapter-number">Chapter {currentChapter.chapterNumber}</div>
          <h1 className="chapter-title">{currentChapter.title}</h1>
          <div className="chapter-meta">
            <span>⏱️ {Math.max(1, Math.ceil((currentChapter.content?.split(/\s+/).filter(Boolean).length || 180) / 180))} min read</span>
            <span>📝 {currentChapter.content?.split(/\s+/).filter(Boolean).length || 0} words</span>
          </div>
        </div>

        <hr className="reader-divider" />

        <div className="story-content" style={{ fontSize, lineHeight }}>
          {paragraphs.map((paragraph, index) => (
            <p key={`${currentChapter.id}-${index}`}>
              {index === 0 && paragraph.length > 0 && <span className="drop-cap">{paragraph.charAt(0)}</span>}
              {index === 0 ? paragraph.slice(1) : paragraph}
            </p>
          ))}
        </div>

        <hr className="reader-divider" />

        <div className="reader-nav">
          <button
            className="reader-nav-button"
            onClick={() => goToChapter(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button
            className="reader-nav-button reader-nav-button-next"
            onClick={() => goToChapter(currentIndex + 1)}
            disabled={currentIndex === chapters.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="reader-back-link">
          <Link to={`/stories/${id}`}>← Back to story</Link>
        </div>
      </div>
    </div>
  );
};

export default Reader;
