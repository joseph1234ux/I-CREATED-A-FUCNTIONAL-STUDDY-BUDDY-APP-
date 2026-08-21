import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useReader = (storyId, chapterId) => {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Settings with localStorage persistence
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('readerSettings');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      fontFamily: 'Merriweather',
      lineHeight: '1.8',
      theme: 'light',
      width: 'medium',
    };
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('readerSettings', JSON.stringify(settings));
  }, [settings]);

  // Fetch chapters
  useEffect(() => {
    fetchChapters();
  }, [storyId]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories/${storyId}/chapters`);
      const data = response.data || [];
      setChapters(data);
      
      // Find the chapter to start at
      let startIndex = 0;
      if (chapterId) {
        const found = data.findIndex(c => c.id === parseInt(chapterId));
        if (found !== -1) startIndex = found;
      }
      setCurrentIndex(startIndex);
      setCurrentChapter(data[startIndex] || null);
      updateProgress(startIndex, data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (index, total) => {
    if (total > 0) {
      setProgress(((index + 1) / total) * 100);
    }
  };

  const goToChapter = useCallback((index) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentIndex(index);
      setCurrentChapter(chapters[index]);
      updateProgress(index, chapters.length);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapters]);

  const nextChapter = useCallback(() => {
    if (currentIndex < chapters.length - 1) {
      goToChapter(currentIndex + 1);
    }
  }, [currentIndex, chapters.length, goToChapter]);

  const prevChapter = useCallback(() => {
    if (currentIndex > 0) {
      goToChapter(currentIndex - 1);
    }
  }, [currentIndex, goToChapter]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    chapters,
    currentChapter,
    currentIndex,
    loading,
    error,
    progress,
    settings,
    goToChapter,
    nextChapter,
    prevChapter,
    updateSetting,
    totalChapters: chapters.length,
  };
};