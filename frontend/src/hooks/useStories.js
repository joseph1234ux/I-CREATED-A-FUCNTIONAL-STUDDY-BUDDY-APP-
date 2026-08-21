import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

export const useStories = (limit = 50) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories?page=${page}&limit=${limit}`);
      
      // Handle different response formats
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If response is an object with a stories property
        if (Array.isArray(response.data.stories)) {
          data = response.data.stories;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else {
          // If it's a single object, wrap it in an array
          data = [response.data];
        }
      }
      
      // Ensure data is always an array
      if (!Array.isArray(data)) {
        data = [];
      }
      
      if (data.length < limit) {
        setHasMore(false);
      }
      
      setStories(prev => page === 1 ? data : [...prev, ...data]);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  const storiesByGenre = useMemo(() => {
    const genres = {};
    // Ensure stories is an array before iterating
    if (Array.isArray(stories)) {
      stories.forEach(story => {
        if (story && story.category) {
          if (!genres[story.category]) {
            genres[story.category] = [];
          }
          genres[story.category].push(story);
        }
      });
    }
    return genres;
  }, [stories]);

  const getFeatured = useCallback(() => {
    return Array.isArray(stories) && stories.length > 0 ? stories[0] : null;
  }, [stories]);

  return {
    stories: Array.isArray(stories) ? stories : [],
    loading,
    error,
    hasMore,
    loadMore,
    storiesByGenre,
    getFeatured,
    total: Array.isArray(stories) ? stories.length : 0,
  };
};