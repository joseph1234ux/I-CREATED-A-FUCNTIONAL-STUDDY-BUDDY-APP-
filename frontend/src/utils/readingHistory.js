// Save reading progress
export const saveReadingProgress = (storyId, chapterId, chapterNumber) => {
  const history = getReadingHistory();
  // Remove duplicate entry if exists
  const filtered = history.filter(item => item.storyId !== storyId);
  // Add new entry at the top
  const updated = [
    { storyId, chapterId, chapterNumber, timestamp: Date.now() },
    ...filtered,
  ];
  // Keep only last 20 stories
  localStorage.setItem('readingHistory', JSON.stringify(updated.slice(0, 20)));
};

// Get full reading history
export const getReadingHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('readingHistory')) || [];
  } catch {
    return [];
  }
};

// Get latest read story
export const getLatestRead = () => {
  const history = getReadingHistory();
  return history.length > 0 ? history[0] : null;
};

// Get a specific story progress
export const getStoryProgress = (storyId) => {
  const history = getReadingHistory();
  return history.find(item => item.storyId === storyId) || null;
};