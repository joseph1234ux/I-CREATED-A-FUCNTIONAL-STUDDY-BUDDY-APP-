import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

const LessonProgress = ({ lessons = [], courseId }) => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`course_${courseId}_progress`);
      const parsed = saved ? JSON.parse(saved) : [];
      const validCompleted = Array.isArray(parsed) ? parsed : [];
      setCompletedLessons(validCompleted);
      setProgress(lessons.length ? Math.round((validCompleted.length / lessons.length) * 100) : 0);
    } catch {
      setCompletedLessons([]);
      setProgress(0);
    }
  }, [courseId, lessons.length]);

  const handleLessonComplete = (lessonId) => {
    if (completedLessons.includes(lessonId)) return;
    
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(updated));
    setProgress(lessons.length ? Math.round((updated.length / lessons.length) * 100) : 0);
  };

  const toggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const isComplete = (lessonId) => completedLessons.includes(lessonId);

  return (
    <div>
      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>Course Progress</span>
          <span style={{ fontWeight: '700', color: '#4f46e5' }}>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          {completedLessons.length} of {lessons.length} lessons completed
        </p>
        {progress === 100 && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: '#d1fae5',
            borderRadius: '8px',
            color: '#065f46',
            textAlign: 'center',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            Course Complete! You've finished all lessons!
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            style={{
              background: isComplete(lesson.id) ? '#f0fdf4' : 'var(--bg-card, white)',
              borderRadius: '12px',
              border: `1px solid ${isComplete(lesson.id) ? '#86efac' : 'var(--border-color, #e2e8f0)'}`,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Lesson Header - Click to expand */}
            <div
              onClick={() => toggleLesson(lesson.id)}
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: expandedLesson === lesson.id ? '1px solid var(--border-color, #e2e8f0)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isComplete(lesson.id) ? '#10b981' : 'var(--border-color, #e2e8f0)',
                  color: isComplete(lesson.id) ? 'white' : 'var(--text-secondary, #64748b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                }}>
                  {index + 1}
                </span>
                <div>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary, #0f172a)' }}>
                    {lesson.title}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)', marginLeft: '12px' }}>
                    {lesson.duration}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isComplete(lesson.id) && (
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </span>
                )}
                <span style={{ color: 'var(--text-secondary, #64748b)', fontSize: '20px' }}>
                  {expandedLesson === lesson.id ? '▾' : '▸'}
                </span>
              </div>
            </div>

            {/* Video Player - Only shows when expanded */}
            {expandedLesson === lesson.id && lesson.videoUrl && (
              <VideoPlayer
                videoUrl={lesson.videoUrl}
                title={lesson.title}
                isCompleted={isComplete(lesson.id)}
                onComplete={() => handleLessonComplete(lesson.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonProgress;