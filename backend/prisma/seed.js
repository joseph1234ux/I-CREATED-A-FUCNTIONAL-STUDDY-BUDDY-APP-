const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// Helper to convert "MM:SS" to seconds
function parseDuration(durationStr) {
  if (!durationStr) return null;
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(durationStr) || null;
}

// Helper to create slug
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ===== ALL 180 COURSES WITH LESSONS =====
const coursesData = [
  // ========== WEB DEVELOPMENT (18) ==========
  {
    id: 1,
    title: 'HTML & CSS Fundamentals',
    price: 29.99,
    category: 'Web Development',
    totalStudents: 45,
    description: 'Master HTML and CSS from the ground up. Learn to build beautiful, responsive websites with modern CSS techniques including Flexbox, Grid, and animations.',
    instructor: 'Prof. John Smith',
    lessons: [
      { id: 1, title: 'HTML Structure and Semantic Elements', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc' },
      { id: 2, title: 'CSS Basics - Colors, Fonts & Box Model', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
      { id: 3, title: 'Flexbox Layout Mastery', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/3YW65K6Lc4Q' },
      { id: 4, title: 'CSS Grid - Advanced Layouts', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/EFafSYg-PkI' },
      { id: 5, title: 'Responsive Web Design', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/srvUrASNj0s' }
    ]
  },
  {
    id: 2,
    title: 'JavaScript Mastery',
    price: 49.99,
    category: 'Web Development',
    totalStudents: 38,
    description: 'Complete JavaScript course from beginner to advanced. Covers ES6, DOM manipulation, asynchronous programming, and modern JavaScript frameworks.',
    instructor: 'Dr. Sarah Johnson',
    lessons: [
      { id: 1, title: 'JavaScript Basics - Variables & Data Types', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
      { id: 2, title: 'Functions and Scope', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/xUJ2xYZUf9I' },
      { id: 3, title: 'DOM Manipulation', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/0ik6X4DJKCc' },
      { id: 4, title: 'ES6 Features - Arrow Functions, Classes', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/NCwa_xi0Uu8' },
      { id: 5, title: 'Asynchronous JavaScript - Promises & Async/Await', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/V_Kr9OSfDeU' },
      { id: 6, title: 'JavaScript Project - Build a Todo App', duration: '70:00', videoUrl: 'https://www.youtube.com/embed/Ttf3CEsEwuo' }
    ]
  },
  {
    id: 3,
    title: 'React.js Complete Guide',
    price: 59.99,
    category: 'Web Development',
    totalStudents: 52,
    description: 'Build modern web applications with React.js. Learn components, hooks, state management, routing, and deployment.',
    instructor: 'Mike Williams',
    lessons: [
      { id: 1, title: 'React Fundamentals - JSX & Components', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0' },
      { id: 2, title: 'Props and State Management', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdCI' },
      { id: 3, title: 'React Hooks - useState, useEffect', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/9L8FFZtDn6E' },
      { id: 4, title: 'Context API and Global State', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc' },
      { id: 5, title: 'React Router - Navigation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/ULcM3bHnP2Y' }
    ]
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    price: 54.99,
    category: 'Web Development',
    totalStudents: 31,
    description: 'Build scalable backend applications with Node.js and Express. Learn REST APIs, middleware, authentication, and database integration.',
    instructor: 'Alex Rivera',
    lessons: [
      { id: 1, title: 'Node.js Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' },
      { id: 2, title: 'Express.js - Routes & Middleware', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE' },
      { id: 3, title: 'REST API Development', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48' },
      { id: 4, title: 'Authentication & JWT', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4' },
      { id: 5, title: 'Database Integration with MongoDB', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/ExcRbA7fy_A' }
    ]
  },
  {
    id: 5,
    title: 'Full Stack Web Development',
    price: 79.99,
    category: 'Web Development',
    totalStudents: 67,
    description: 'The complete full-stack development course covering React, Node.js, MongoDB, and deployment. Build real-world projects from scratch.',
    instructor: 'Dr. Emily Chen',
    lessons: [
      { id: 1, title: 'Frontend with React', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0' },
      { id: 2, title: 'Backend with Node.js', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE' },
      { id: 3, title: 'Database with MongoDB', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ExcRbA7fy_A' },
      { id: 4, title: 'Authentication & Authorization', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/2jqok-WgelI' },
      { id: 5, title: 'Deployment & DevOps', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 6, title: 'Real-World Project - E-commerce', duration: '80:00', videoUrl: 'https://www.youtube.com/embed/8XkH2o4xX9Q' }
    ]
  },
  {
    id: 6,
    title: 'Advanced CSS & SASS',
    price: 34.99,
    category: 'Web Development',
    totalStudents: 29,
    description: 'Take your CSS skills to the next level with advanced techniques, SASS, animations, and modern CSS architecture patterns.',
    instructor: 'Linda Park',
    lessons: [
      { id: 1, title: 'SASS Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
      { id: 2, title: 'CSS Animations & Transitions', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/zHUpx90NerM' },
      { id: 3, title: 'CSS Architecture - BEM & SMACSS', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/6PlRf_LbyPw' },
      { id: 4, title: 'Modern CSS Features', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/XZiS9lURfck' }
    ]
  },
  {
    id: 7,
    title: 'Vue.js Mastery',
    price: 49.99,
    category: 'Web Development',
    totalStudents: 33,
    description: 'Build modern web applications with Vue.js. Learn the basics, Vue Router, Vuex, and build real-world projects.',
    instructor: 'Chris Evans',
    lessons: [
      { id: 1, title: 'Vue.js Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/qZXt1Aom3Cs' },
      { id: 2, title: 'Vue Components & Props', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/Fn4XlVZOfq4' },
      { id: 3, title: 'Vue Router', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/3dHNOWTI7H8' },
      { id: 4, title: 'Vuex State Management', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/oxUyIzDbZts' },
      { id: 5, title: 'Vue.js Project - Build a Dashboard', duration: '70:00', videoUrl: 'https://www.youtube.com/embed/m1_ih43p24s' }
    ]
  },
  {
    id: 8,
    title: 'Angular Complete Guide',
    price: 54.99,
    category: 'Web Development',
    totalStudents: 27,
    description: 'Master Angular from the ground up. Learn components, services, routing, forms, and build large-scale applications.',
    instructor: 'Rebecca Kim',
    lessons: [
      { id: 1, title: 'Angular Fundamentals', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/3dHNOWTI7H8' },
      { id: 2, title: 'Components & Directives', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0eWrpsCLMJQ' },
      { id: 3, title: 'Services & Dependency Injection', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/3dHNOWTI7H8' },
      { id: 4, title: 'Routing in Angular', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2I1xTTRZxLo' },
      { id: 5, title: 'Forms & Validation', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/jgXHH4-ulYw' }
    ]
  },
  {
    id: 9,
    title: 'Next.js & Server Side Rendering',
    price: 64.99,
    category: 'Web Development',
    totalStudents: 22,
    description: 'Learn Next.js and build server-side rendered React applications. Master static site generation, API routes, and deployment.',
    instructor: 'Dr. Mark Lee',
    lessons: [
      { id: 1, title: 'Next.js Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/1WmNXEVia8I' },
      { id: 2, title: 'SSR & Static Generation', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/OwqWwCj_zS0' },
      { id: 3, title: 'API Routes in Next.js', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2bUJmpFYqHs' },
      { id: 4, title: 'Authentication in Next.js', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/1tG-t7dSVBE' },
      { id: 5, title: 'Deploying Next.js Apps', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/Yk4DpS3A3Bw' }
    ]
  },
  {
    id: 10,
    title: 'TypeScript for Beginners',
    price: 39.99,
    category: 'Web Development',
    totalStudents: 41,
    description: 'Learn TypeScript from scratch. Understand types, interfaces, classes, and build type-safe applications with JavaScript.',
    instructor: 'Sophia Martin',
    lessons: [
      { id: 1, title: 'TypeScript Basics', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/ahCwqrYpIuM' },
      { id: 2, title: 'Types & Interfaces', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2pZmKW9-I_k' },
      { id: 3, title: 'Classes & Generics', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/jBmrduvX5YI' },
      { id: 4, title: 'TypeScript with React', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/5PmHRvA8w20' }
    ]
  },
  {
    id: 11,
    title: 'GraphQL API Development',
    price: 44.99,
    category: 'Web Development',
    totalStudents: 19,
    description: 'Build flexible and efficient APIs with GraphQL. Learn schema design, resolvers, Apollo Server, and integrate with databases.',
    instructor: 'David Wilson',
    lessons: [
      { id: 1, title: 'GraphQL Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ed8SzALpx1Q' },
      { id: 2, title: 'Schema & Types', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/lAJWHHUz8B8' },
      { id: 3, title: 'Resolvers & Queries', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/_9RgH85qEdc' },
      { id: 4, title: 'Apollo Server & Client', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/EjD7O8RUE04' },
      { id: 5, title: 'GraphQL Subscriptions', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ZVrHVFNjB6E' }
    ]
  },
  {
    id: 12,
    title: 'Django Web Framework',
    price: 49.99,
    category: 'Web Development',
    totalStudents: 36,
    description: 'Build powerful web applications with Django. Learn models, views, templates, authentication, and deployment.',
    instructor: 'Dr. James Brown',
    lessons: [
      { id: 1, title: 'Django Fundamentals', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/F5mRW0jo-U4' },
      { id: 2, title: 'Models & Database', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/jBz9oRjzG2c' },
      { id: 3, title: 'Views & Templates', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/3t2wO7Ujf_o' },
      { id: 4, title: 'Authentication in Django', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/s1kVUj6-XQ8' },
      { id: 5, title: 'Deploying Django Apps', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/f8zDNU2wE7s' }
    ]
  },
  {
    id: 13,
    title: 'Flask Web Development',
    price: 39.99,
    category: 'Web Development',
    totalStudents: 28,
    description: 'Build lightweight web applications with Flask. Learn routes, templates, forms, authentication, and database integration.',
    instructor: 'Maria Gonzalez',
    lessons: [
      { id: 1, title: 'Flask Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/Z1RJmh_OqeA' },
      { id: 2, title: 'Routes & Templates', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/mqhxxeeTbu0' },
      { id: 3, title: 'Forms & Validation', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/UIJKdCIkUZU' },
      { id: 4, title: 'Authentication with Flask', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/71EU8gnZqZQ' },
      { id: 5, title: 'Deploying Flask Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' }
    ]
  },
  {
    id: 14,
    title: 'PHP & MySQL Mastery',
    price: 44.99,
    category: 'Web Development',
    totalStudents: 34,
    description: 'Master PHP and MySQL for web development. Build dynamic websites, handle forms, authentication, and database operations.',
    instructor: 'Robert Taylor',
    lessons: [
      { id: 1, title: 'PHP Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c' },
      { id: 2, title: 'Forms & User Input', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/lX1Qmb_-C1U' },
      { id: 3, title: 'MySQL Database Operations', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/yPu6qV5byu4' },
      { id: 4, title: 'Authentication & Sessions', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/2eebptXfEvw' },
      { id: 5, title: 'Building a CRUD Application', duration: '70:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' }
    ]
  },
  {
    id: 15,
    title: 'Laravel Framework Guide',
    price: 49.99,
    category: 'Web Development',
    totalStudents: 25,
    description: 'Build modern web applications with Laravel. Learn MVC, Eloquent ORM, authentication, and deployment.',
    instructor: 'Kevin White',
    lessons: [
      { id: 1, title: 'Laravel Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/BrD2qG0XG98' },
      { id: 2, title: 'Eloquent ORM & Models', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/1I1sYyQdVrM' },
      { id: 3, title: 'Authentication & Authorization', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/A5sfyQiABrY' },
      { id: 4, title: 'Blade Templates', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/FJZvJ7ShyMs' },
      { id: 5, title: 'Deploying Laravel Apps', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/NUVsL6e2Fj8' }
    ]
  },
  {
    id: 16,
    title: 'Web Performance Optimization',
    price: 34.99,
    category: 'Web Development',
    totalStudents: 21,
    description: 'Optimize website performance, reduce load times, and improve user experience. Learn caching, lazy loading, and best practices.',
    instructor: 'Amanda Foster',
    lessons: [
      { id: 1, title: 'Performance Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/4Sso4H8Txns' },
      { id: 2, title: 'Caching Strategies', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2uV4K3jIl0M' },
      { id: 3, title: 'Lazy Loading & Code Splitting', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/gT0Lh1eYk78' },
      { id: 4, title: 'Image Optimization', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/Sw8IpK4NwDA' }
    ]
  },
  {
    id: 17,
    title: 'Responsive Web Design',
    price: 29.99,
    category: 'Web Development',
    totalStudents: 48,
    description: 'Build websites that work perfectly on all devices. Learn media queries, fluid layouts, and mobile-first design principles.',
    instructor: 'Laura Bennett',
    lessons: [
      { id: 1, title: 'Responsive Design Principles', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/srvUrASNj0s' },
      { id: 2, title: 'Media Queries & Breakpoints', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/aook54S7hho' },
      { id: 3, title: 'Fluid Layouts & Images', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/VQraviuw_rU' },
      { id: 4, title: 'Mobile-First Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/0ohtVzCSHbo' }
    ]
  },
  {
    id: 18,
    title: 'Web Security Essentials',
    price: 39.99,
    category: 'Web Development',
    totalStudents: 24,
    description: 'Learn web security fundamentals including HTTPS, CSP, XSS prevention, CSRF protection, and secure authentication practices.',
    instructor: 'Dr. Michael Park',
    lessons: [
      { id: 1, title: 'Security Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/PWAVGjNkR6M' },
      { id: 2, title: 'XSS & CSRF Prevention', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/T1qT4P4E3oE' },
      { id: 3, title: 'Secure Authentication', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/2jqok-WgelI' },
      { id: 4, title: 'HTTPS & Security Headers', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/GoXgl9r0Kjk' },
      { id: 5, title: 'Security Best Practices', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/1RTwnZ8FyX4' }
    ]
  },

  // ========== DATA SCIENCE (18) ==========
  {
    id: 19,
    title: 'Python for Data Science',
    price: 49.99,
    category: 'Data Science',
    totalStudents: 42,
    description: 'Learn Python for data science including NumPy, Pandas, Matplotlib, and data visualization.',
    instructor: 'Dr. Rachel Adams',
    lessons: [
      { id: 1, title: 'Python Basics for Data Science', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI' },
      { id: 2, title: 'NumPy Fundamentals', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
      { id: 3, title: 'Pandas for Data Analysis', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' },
      { id: 4, title: 'Data Visualization with Matplotlib', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4' },
      { id: 5, title: 'Real-World Data Project', duration: '65:00', videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8' }
    ]
  },
  {
    id: 20,
    title: 'Machine Learning Fundamentals',
    price: 69.99,
    category: 'Data Science',
    totalStudents: 29,
    description: 'Master machine learning algorithms including regression, classification, clustering, and evaluation metrics with hands-on projects.',
    instructor: 'Prof. Andrew Ng',
    lessons: [
      { id: 1, title: 'ML Introduction & Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/GwIo3gDZCVQ' },
      { id: 2, title: 'Linear & Logistic Regression', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/zM4VZR0px8E' },
      { id: 3, title: 'Decision Trees & Random Forests', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/7VeUPuFGJHk' },
      { id: 4, title: 'Clustering Algorithms', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/4b5d3muPQmA' },
      { id: 5, title: 'Model Evaluation & Selection', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/0P7UXWArWPE' }
    ]
  },
  {
    id: 21,
    title: 'Data Analysis with Pandas',
    price: 44.99,
    category: 'Data Science',
    totalStudents: 35,
    description: 'Master data analysis and manipulation with Pandas, including data cleaning, transformation, grouping, and visualization.',
    instructor: 'Kevin Zhang',
    lessons: [
      { id: 1, title: 'Pandas Series & DataFrames', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' },
      { id: 2, title: 'Data Cleaning & Preparation', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/8c0I3gQmwGM' },
      { id: 3, title: 'Data Transformation & Grouping', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/_T8LGqJtuGc' },
      { id: 4, title: 'Merging & Joining Data', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0W9TQnQHc4Y' },
      { id: 5, title: 'Advanced Pandas Techniques', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/hK6o_TDXXN8' }
    ]
  },
  {
    id: 22,
    title: 'SQL for Data Analysis',
    price: 39.99,
    category: 'Data Science',
    totalStudents: 28,
    description: 'Learn SQL for data analysis including queries, joins, subqueries, window functions, and data aggregation techniques.',
    instructor: 'Emma Watson',
    lessons: [
      { id: 1, title: 'SQL Basics - SELECT & FROM', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY' },
      { id: 2, title: 'Filtering & Sorting Data', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA' },
      { id: 3, title: 'Joins in SQL', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/9yeOJ0ZMUYw' },
      { id: 4, title: 'Subqueries & CTEs', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' },
      { id: 5, title: 'Window Functions & Aggregation', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/Ww71knvhQ-s' }
    ]
  },
  {
    id: 23,
    title: 'AI & Deep Learning',
    price: 89.99,
    category: 'Data Science',
    totalStudents: 22,
    description: 'Dive deep into artificial intelligence and deep learning with neural networks, CNNs, RNNs, and transformers.',
    instructor: 'Dr. Andrew Ng',
    lessons: [
      { id: 1, title: 'AI & Deep Learning Overview', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk' },
      { id: 2, title: 'Neural Networks Fundamentals', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk' },
      { id: 3, title: 'CNNs for Image Processing', duration: '65:00', videoUrl: 'https://www.youtube.com/embed/YRhxdVk_sIs' },
      { id: 4, title: 'RNNs & LSTMs for Sequence Data', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/8HyCNIVRbSU' },
      { id: 5, title: 'Transformers & Attention', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/TQQlZhbC5ps' },
      { id: 6, title: 'Building AI Applications', duration: '70:00', videoUrl: 'https://www.youtube.com/embed/0a5y4oKv7qg' }
    ]
  },
  {
    id: 24,
    title: 'Data Visualization with Matplotlib',
    price: 34.99,
    category: 'Data Science',
    totalStudents: 31,
    description: 'Create beautiful and insightful data visualizations with Matplotlib and Seaborn. Learn to tell stories with data.',
    instructor: 'Michelle Roberts',
    lessons: [
      { id: 1, title: 'Matplotlib Basics', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4' },
      { id: 2, title: 'Creating Charts & Plots', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/0P7UXWArWPE' },
      { id: 3, title: 'Advanced Visualizations', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/o3GZRlUwwB0' },
      { id: 4, title: 'Seaborn for Statistical Plots', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/0P7UXWArWPE' }
    ]
  },
  {
    id: 25,
    title: 'Statistical Analysis & Probability',
    price: 44.99,
    category: 'Data Science',
    totalStudents: 26,
    description: 'Master statistical analysis concepts including probability distributions, hypothesis testing, regression, and Bayesian analysis.',
    instructor: 'Dr. Thomas Brown',
    lessons: [
      { id: 1, title: 'Probability Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/3Ib4iBfzZ4w' },
      { id: 2, title: 'Distributions & Sampling', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5GcI9GXkGkE' },
      { id: 3, title: 'Hypothesis Testing', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/VK-rnA3-41c' },
      { id: 4, title: 'Regression Analysis', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/zM4VZR0px8E' },
      { id: 5, title: 'Bayesian Statistics', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/bs1I3zIqg5Q' }
    ]
  },
  {
    id: 26,
    title: 'Time Series Analysis',
    price: 49.99,
    category: 'Data Science',
    totalStudents: 18,
    description: 'Learn to analyze and forecast time series data including trends, seasonality, ARIMA, and deep learning for sequences.',
    instructor: 'Dr. Jessica Park',
    lessons: [
      { id: 1, title: 'Time Series Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/vVjUxP0TjTk' },
      { id: 2, title: 'Trends & Seasonality', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/7aXw3aThaHk' },
      { id: 3, title: 'ARIMA Models', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/03nFzp4kXuo' },
      { id: 4, title: 'Deep Learning for Time Series', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/4RY7R0W7R8w' }
    ]
  },
  {
    id: 27,
    title: 'Natural Language Processing',
    price: 59.99,
    category: 'Data Science',
    totalStudents: 15,
    description: 'Master natural language processing with Python. Learn text preprocessing, sentiment analysis, NER, transformers, and LLMs.',
    instructor: 'Dr. Alex Wang',
    lessons: [
      { id: 1, title: 'NLP Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/CMrHM8a3hqw' },
      { id: 2, title: 'Text Preprocessing', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/8Q9TPx5zVY0' },
      { id: 3, title: 'Sentiment Analysis', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/8Q9TPx5zVY0' },
      { id: 4, title: 'BERT & Transformers', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/1J2i3PGz6eM' },
      { id: 5, title: 'LLMs & Fine-tuning', duration: '65:00', videoUrl: 'https://www.youtube.com/embed/5jZ1KBaFYkY' }
    ]
  },
  {
    id: 28,
    title: 'Computer Vision Fundamentals',
    price: 64.99,
    category: 'Data Science',
    totalStudents: 14,
    description: 'Learn computer vision techniques including image processing, edge detection, feature extraction, and CNN-based applications.',
    instructor: 'Dr. Lisa Chen',
    lessons: [
      { id: 1, title: 'Image Processing Basics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/VwVg9jCtqaU' },
      { id: 2, title: 'Edge Detection & Features', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0y7h_oA8eHw' },
      { id: 3, title: 'CNN Architecture', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/YRhxdVk_sIs' },
      { id: 4, title: 'Object Detection & Tracking', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/ArPaAX_PhIs' },
      { id: 5, title: 'Real-world CV Applications', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0y7h_oA8eHw' }
    ]
  },
  {
    id: 29,
    title: 'Big Data with Spark',
    price: 54.99,
    category: 'Data Science',
    totalStudents: 20,
    description: 'Learn to process big data using Apache Spark and PySpark. Understand RDDs, DataFrames, SQL, and machine learning with Spark.',
    instructor: 'Dr. Mike Johnson',
    lessons: [
      { id: 1, title: 'Spark Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/6K8a6WY0pKA' },
      { id: 2, title: 'RDDs & DataFrames', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/4iB7abCcp9o' },
      { id: 3, title: 'Spark SQL & Streaming', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/AQtvB5gQ_94' },
      { id: 4, title: 'MLlib for Machine Learning', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/YN59X6pURkM' }
    ]
  },
  {
    id: 30,
    title: 'Power BI for Data Visualization',
    price: 39.99,
    category: 'Data Science',
    totalStudents: 33,
    description: 'Learn to create interactive dashboards and reports with Power BI. Connect to data sources, transform data, and visualize insights.',
    instructor: 'Sarah Lewis',
    lessons: [
      { id: 1, title: 'Power BI Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/AGrl-HA5w5A' },
      { id: 2, title: 'Data Modeling & DAX', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/AGrl-HA5w5A' },
      { id: 3, title: 'Creating Visualizations', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/8YJsB6cAAQY' },
      { id: 4, title: 'Interactive Dashboards', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/3xBD1r9c1Qg' },
      { id: 5, title: 'Power BI Services', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/3xBD1r9c1Qg' }
    ]
  },
  {
    id: 31,
    title: 'Tableau Essentials',
    price: 44.99,
    category: 'Data Science',
    totalStudents: 29,
    description: 'Master Tableau for data visualization and business intelligence. Create powerful dashboards, stories, and analytics.',
    instructor: 'Emily Davis',
    lessons: [
      { id: 1, title: 'Tableau Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/1sphvQnI5g4' },
      { id: 2, title: 'Data Connections & Blending', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/1sphvQnI5g4' },
      { id: 3, title: 'Creating Visualizations', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/6dLm0dHimto' },
      { id: 4, title: 'Dashboards & Stories', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/6dLm0dHimto' }
    ]
  },
  {
    id: 32,
    title: 'Data Engineering Basics',
    price: 49.99,
    category: 'Data Science',
    totalStudents: 24,
    description: 'Learn data engineering fundamentals including ETL pipelines, data warehousing, data lakes, and workflow orchestration.',
    instructor: 'David Martinez',
    lessons: [
      { id: 1, title: 'Data Engineering Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/qWru-b6m0Hs' },
      { id: 2, title: 'ETL & ELT Pipelines', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/qWru-b6m0Hs' },
      { id: 3, title: 'Data Warehousing', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/PqTk4oO_Meg' },
      { id: 4, title: 'Data Lakes & Storage', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/4-4e2i9Ww7Y' },
      { id: 5, title: 'Workflow Orchestration', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/4-4e2i9Ww7Y' }
    ]
  },
  {
    id: 33,
    title: 'R for Data Science',
    price: 39.99,
    category: 'Data Science',
    totalStudents: 27,
    description: 'Learn R programming for data science including data manipulation with dplyr, visualization with ggplot2, and statistical modeling.',
    instructor: 'Dr. Jennifer Lee',
    lessons: [
      { id: 1, title: 'R Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/_V8eKsto3Ug' },
      { id: 2, title: 'Data Manipulation with dplyr', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/jWjqLW-u3hc' },
      { id: 3, title: 'Visualization with ggplot2', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/HPJn1CMvtmI' },
      { id: 4, title: 'Statistical Modeling in R', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/HPJn1CMvtmI' }
    ]
  },
  {
    id: 34,
    title: 'Excel for Data Analysis',
    price: 29.99,
    category: 'Data Science',
    totalStudents: 42,
    description: 'Master Excel for data analysis including formulas, pivot tables, Power Query, and data visualization for business intelligence.',
    instructor: 'Mark Thompson',
    lessons: [
      { id: 1, title: 'Excel Basics for Data', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2xT6jVPSsBI' },
      { id: 2, title: 'Formulas & Functions', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2xT6jVPSsBI' },
      { id: 3, title: 'Pivot Tables & Power Query', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/8Xp2_wT3kF0' },
      { id: 4, title: 'Data Visualization in Excel', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/8Xp2_wT3kF0' }
    ]
  },
  {
    id: 35,
    title: 'TensorFlow Mastery',
    price: 74.99,
    category: 'Data Science',
    totalStudents: 17,
    description: 'Master TensorFlow for deep learning including neural networks, CNNs, RNNs, and production deployment of models.',
    instructor: 'Dr. Martin Chen',
    lessons: [
      { id: 1, title: 'TensorFlow Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk' },
      { id: 2, title: 'Neural Networks with TF', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk' },
      { id: 3, title: 'CNNs with TensorFlow', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/EWWn3x0q3vs' },
      { id: 4, title: 'RNNs & LSTMs', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/EWWn3x0q3vs' },
      { id: 5, title: 'Deploying TF Models', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/f_u2lFqzjM4' }
    ]
  },
  {
    id: 36,
    title: 'PyTorch Deep Learning',
    price: 69.99,
    category: 'Data Science',
    totalStudents: 16,
    description: 'Master PyTorch for deep learning including dynamic computation graphs, custom models, and production deployment.',
    instructor: 'Dr. Sarah Kim',
    lessons: [
      { id: 1, title: 'PyTorch Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/XfY3H-IfpRg' },
      { id: 2, title: 'Building Models with PyTorch', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/XfY3H-IfpRg' },
      { id: 3, title: 'CNNs in PyTorch', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/ISXyRjRhYfE' },
      { id: 4, title: 'RNNs in PyTorch', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/ISXyRjRhYfE' },
      { id: 5, title: 'Deploying PyTorch Models', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0a5y4oKv7qg' }
    ]
  },

  // ========== DESIGN (18) ==========
  {
    id: 37,
    title: 'UI/UX Design Fundamentals',
    price: 39.99,
    category: 'Design',
    totalStudents: 48,
    description: 'Learn UI/UX design principles including user research, wireframing, prototyping, and usability testing. Design better experiences.',
    instructor: 'Laura Martinez',
    lessons: [
      { id: 1, title: 'UI/UX Principles', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
      { id: 2, title: 'User Research & Personas', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
      { id: 3, title: 'Wireframing & Prototyping', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/2Hp8Zcsk-Sc' },
      { id: 4, title: 'Usability Testing', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2Hp8Zcsk-Sc' }
    ]
  },
  {
    id: 38,
    title: 'Figma Masterclass',
    price: 44.99,
    category: 'Design',
    totalStudents: 33,
    description: 'Master Figma for UI/UX design including components, auto layout, prototyping, and collaboration features for design teams.',
    instructor: 'Rachel Kim',
    lessons: [
      { id: 1, title: 'Figma Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/3q3FV65ZrUs' },
      { id: 2, title: 'Components & Variants', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/3q3FV65ZrUs' },
      { id: 3, title: 'Auto Layout & Constraints', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5vK2_0mHYC8' },
      { id: 4, title: 'Prototyping in Figma', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5vK2_0mHYC8' },
      { id: 5, title: 'Collaboration & Handoff', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/9fC1c9PK2MQ' }
    ]
  },
  {
    id: 39,
    title: 'Graphic Design with Photoshop',
    price: 34.99,
    category: 'Design',
    totalStudents: 41,
    description: 'Learn professional graphic design with Adobe Photoshop including layers, masks, typography, and photo manipulation.',
    instructor: 'John Smith',
    lessons: [
      { id: 1, title: 'Photoshop Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Layers & Masks', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Color & Typography', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/UHpPvKxsF5A' },
      { id: 4, title: 'Photo Manipulation', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/UHpPvKxsF5A' }
    ]
  },
  {
    id: 40,
    title: 'Adobe Illustrator Essentials',
    price: 34.99,
    category: 'Design',
    totalStudents: 27,
    description: 'Master Adobe Illustrator for vector graphics including shapes, paths, typography, and logo design for professional projects.',
    instructor: 'Jessica Chen',
    lessons: [
      { id: 1, title: 'Illustrator Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Shapes & Paths', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Typography & Text Effects', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/4s1w9Tz_Ris' },
      { id: 4, title: 'Logo Design', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/4s1w9Tz_Ris' }
    ]
  },
  {
    id: 41,
    title: 'Canva Design for Beginners',
    price: 24.99,
    category: 'Design',
    totalStudents: 55,
    description: 'Learn to create stunning designs with Canva including social media graphics, presentations, and marketing materials.',
    instructor: 'Emily Brown',
    lessons: [
      { id: 1, title: 'Canva Fundamentals', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Templates & Branding', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Social Media Graphics', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Presentations & Marketing', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 42,
    title: 'Adobe XD Prototyping',
    price: 39.99,
    category: 'Design',
    totalStudents: 22,
    description: 'Master Adobe XD for UI/UX design including wireframes, prototypes, interaction design, and design systems for teams.',
    instructor: 'David Lee',
    lessons: [
      { id: 1, title: 'XD Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Wireframing in XD', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Interaction Design', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Design Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 43,
    title: 'Design Thinking Workshop',
    price: 44.99,
    category: 'Design',
    totalStudents: 29,
    description: 'Learn the design thinking process including empathy, definition, ideation, prototyping, and testing for innovative solutions.',
    instructor: 'Dr. Sarah Johnson',
    lessons: [
      { id: 1, title: 'Design Thinking Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Empathy & Define', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Ideation & Prototyping', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Testing & Implementation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 44,
    title: 'Color Theory & Typography',
    price: 29.99,
    category: 'Design',
    totalStudents: 38,
    description: 'Master color theory and typography principles for design. Understand color psychology, combinations, and typeface selection.',
    instructor: 'Maria Rodriguez',
    lessons: [
      { id: 1, title: 'Color Theory Fundamentals', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Color Psychology', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Typography Basics', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Typeface Selection', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 45,
    title: 'Mobile App Design',
    price: 44.99,
    category: 'Design',
    totalStudents: 25,
    description: 'Learn mobile app design principles including iOS and Android patterns, responsive design, and user-centered mobile experiences.',
    instructor: 'Alex Turner',
    lessons: [
      { id: 1, title: 'Mobile Design Principles', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'iOS vs Android Patterns', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Responsive Mobile Design', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Mobile UX Best Practices', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 46,
    title: 'Web Design Principles',
    price: 34.99,
    category: 'Design',
    totalStudents: 41,
    description: 'Learn professional web design principles including layout, typography, color, and user experience for modern websites.',
    instructor: 'Kevin Brown',
    lessons: [
      { id: 1, title: 'Web Design Fundamentals', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Layout & Structure', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Web Typography', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'User Experience Principles', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 47,
    title: '3D Design with Blender',
    price: 49.99,
    category: 'Design',
    totalStudents: 19,
    description: 'Master 3D design and modeling with Blender including modeling, texturing, lighting, and animation for professional projects.',
    instructor: 'Dr. Robert Chen',
    lessons: [
      { id: 1, title: 'Blender Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: '3D Modeling', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Texturing & Materials', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Lighting & Rendering', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 5, title: 'Animation in Blender', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 48,
    title: 'Brand Identity Design',
    price: 39.99,
    category: 'Design',
    totalStudents: 33,
    description: 'Learn brand identity design including logo creation, color palettes, typography systems, and brand guidelines for businesses.',
    instructor: 'Nina Patel',
    lessons: [
      { id: 1, title: 'Brand Identity Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Logo Design', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Color & Typography Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Brand Guidelines', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 49,
    title: 'Packaging Design',
    price: 34.99,
    category: 'Design',
    totalStudents: 21,
    description: 'Learn professional packaging design including structural design, visual communication, material selection, and production processes.',
    instructor: 'Michael Chang',
    lessons: [
      { id: 1, title: 'Packaging Design Fundamentals', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Structural Design', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Visual Communication', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Production & Materials', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 50,
    title: 'Typography Masterclass',
    price: 29.99,
    category: 'Design',
    totalStudents: 31,
    description: 'Master typography including font selection, hierarchy, spacing, and pairing for professional design projects.',
    instructor: 'David Wilson',
    lessons: [
      { id: 1, title: 'Typography Fundamentals', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Font Selection & Pairing', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Hierarchy & Spacing', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Advanced Typography', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 51,
    title: 'Logo Design & Branding',
    price: 34.99,
    category: 'Design',
    totalStudents: 37,
    description: 'Learn professional logo design and branding including concept development, typography, color, and brand identity systems.',
    instructor: 'Samantha Lee',
    lessons: [
      { id: 1, title: 'Logo Design Process', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Concept Development', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Typography & Color', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Brand Identity Systems', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 52,
    title: 'Motion Graphics with After Effects',
    price: 49.99,
    category: 'Design',
    totalStudents: 23,
    description: 'Master motion graphics with Adobe After Effects including animation, keyframes, effects, and compositing for professional videos.',
    instructor: 'James Park',
    lessons: [
      { id: 1, title: 'After Effects Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Animation & Keyframes', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Effects & Transitions', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Compositing & Rendering', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 53,
    title: 'UI Animation Principles',
    price: 39.99,
    category: 'Design',
    totalStudents: 26,
    description: 'Learn UI animation principles including timing, easing, and motion design for better user experiences in digital products.',
    instructor: 'Sophia Kim',
    lessons: [
      { id: 1, title: 'UI Animation Fundamentals', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Timing & Easing', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Motion Design Principles', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Implementation & Tools', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 54,
    title: 'Product Design Mastery',
    price: 44.99,
    category: 'Design',
    totalStudents: 30,
    description: 'Master product design including user-centered design, prototyping, testing, and iteration for building successful products.',
    instructor: 'Robert Chen',
    lessons: [
      { id: 1, title: 'Product Design Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'User-Centered Design', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Prototyping & Testing', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Iteration & Launch', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== PROGRAMMING (18) ==========
  {
    id: 55,
    title: 'Java Programming Basics',
    price: 39.99,
    category: 'Programming',
    totalStudents: 36,
    description: 'Learn Java programming from the ground up including OOP concepts, control structures, and building real-world applications.',
    instructor: 'Dr. Michael Brown',
    lessons: [
      { id: 1, title: 'Java Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34' },
      { id: 2, title: 'Control Structures', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34' },
      { id: 3, title: 'OOP Concepts', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/grEKMHGYyns' },
      { id: 4, title: 'Collections & Generics', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/grEKMHGYyns' },
      { id: 5, title: 'Building Java Applications', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/grEKMHGYyns' }
    ]
  },
  {
    id: 56,
    title: 'C++ Programming Mastery',
    price: 44.99,
    category: 'Programming',
    totalStudents: 30,
    description: 'Master C++ programming including memory management, OOP, templates, and advanced features for system programming.',
    instructor: 'Dr. Sarah Lee',
    lessons: [
      { id: 1, title: 'C++ Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/_bYFu9mBnr4' },
      { id: 2, title: 'Memory Management', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/_bYFu9mBnr4' },
      { id: 3, title: 'OOP in C++', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ZzaPdXTrSb8' },
      { id: 4, title: 'Templates & STL', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/ZzaPdXTrSb8' },
      { id: 5, title: 'Advanced C++ Features', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/ZzaPdXTrSb8' }
    ]
  },
  {
    id: 57,
    title: 'Python Complete Guide',
    price: 49.99,
    category: 'Programming',
    totalStudents: 55,
    description: 'Complete Python programming guide from beginner to advanced including data structures, modules, and real-world projects.',
    instructor: 'Prof. John Smith',
    lessons: [
      { id: 1, title: 'Python Basics', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8' },
      { id: 2, title: 'Data Structures', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8' },
      { id: 3, title: 'Functions & Modules', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/4i7jQ0vZ91A' },
      { id: 4, title: 'File I/O & Exceptions', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/4i7jQ0vZ91A' },
      { id: 5, title: 'Python Projects', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/4i7jQ0vZ91A' }
    ]
  },
  {
    id: 58,
    title: 'C# & .NET Development',
    price: 49.99,
    category: 'Programming',
    totalStudents: 24,
    description: 'Build applications with C# and .NET including desktop, web, and cloud-based applications with modern development practices.',
    instructor: 'David Martinez',
    lessons: [
      { id: 1, title: 'C# Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/7UeqJQQPp1U' },
      { id: 2, title: 'OOP in C#', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/7UeqJQQPp1U' },
      { id: 3, title: '.NET Framework', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/OTXGx9pA2yc' },
      { id: 4, title: 'Web Development with ASP.NET', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/OTXGx9pA2yc' },
      { id: 5, title: 'Cloud & Deployment', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/OTXGx9pA2yc' }
    ]
  },
  {
    id: 59,
    title: 'R Programming for Data',
    price: 39.99,
    category: 'Programming',
    totalStudents: 19,
    description: 'Learn R programming for data analysis and visualization including data manipulation, statistical modeling, and reporting.',
    instructor: 'Dr. Emily Wilson',
    lessons: [
      { id: 1, title: 'R Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/_V8eKsto3Ug' },
      { id: 2, title: 'Data Structures', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/_V8eKsto3Ug' },
      { id: 3, title: 'Data Manipulation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/jWjqLW-u3hc' },
      { id: 4, title: 'Statistical Analysis', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/jWjqLW-u3hc' }
    ]
  },
  {
    id: 60,
    title: 'Go Language for Beginners',
    price: 34.99,
    category: 'Programming',
    totalStudents: 22,
    description: 'Learn Go programming language including syntax, concurrency, and building high-performance applications and microservices.',
    instructor: 'Robert Kim',
    lessons: [
      { id: 1, title: 'Go Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/yyUHQIec83I' },
      { id: 2, title: 'Functions & Methods', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/yyUHQIec83I' },
      { id: 3, title: 'Concurrency in Go', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/wiVnXk-fSP4' },
      { id: 4, title: 'Building Microservices', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/wiVnXk-fSP4' }
    ]
  },
  {
    id: 61,
    title: 'Rust Programming Essentials',
    price: 39.99,
    category: 'Programming',
    totalStudents: 15,
    description: 'Master Rust programming including ownership, borrowing, and building safe, concurrent, and high-performance applications.',
    instructor: 'Dr. Amanda Lee',
    lessons: [
      { id: 1, title: 'Rust Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/ygL_xcavzQ4' },
      { id: 2, title: 'Ownership & Borrowing', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ygL_xcavzQ4' },
      { id: 3, title: 'Data Structures', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/sWpGQ_sr-JY' },
      { id: 4, title: 'Concurrency & Web Assembly', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/sWpGQ_sr-JY' }
    ]
  },
  {
    id: 62,
    title: 'Swift Programming Guide',
    price: 44.99,
    category: 'Programming',
    totalStudents: 27,
    description: 'Learn Swift programming for iOS and macOS development including syntax, features, and building mobile applications.',
    instructor: 'Rachel Park',
    lessons: [
      { id: 1, title: 'Swift Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/FcsY1YPBwzQ' },
      { id: 2, title: 'Functions & Closures', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/FcsY1YPBwzQ' },
      { id: 3, title: 'OOP & Protocols', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/MiGt1nUxJIk' },
      { id: 4, title: 'SwiftUI & iOS Development', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/MiGt1nUxJIk' }
    ]
  },
  {
    id: 63,
    title: 'Kotlin for Android Development',
    price: 44.99,
    category: 'Programming',
    totalStudents: 31,
    description: 'Learn Kotlin programming for Android development including modern language features and building Android applications.',
    instructor: 'James Chen',
    lessons: [
      { id: 1, title: 'Kotlin Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/F9UC9DY-vIU' },
      { id: 2, title: 'OOP & Features', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/F9UC9DY-vIU' },
      { id: 3, title: 'Android Development', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/bbKm0DnuFyI' },
      { id: 4, title: 'Advanced Kotlin', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/bbKm0DnuFyI' }
    ]
  },
  {
    id: 64,
    title: 'Ruby on Rails Mastery',
    price: 49.99,
    category: 'Programming',
    totalStudents: 23,
    description: 'Master Ruby on Rails for web development including MVC, authentication, RESTful APIs, and deployment of applications.',
    instructor: 'Sarah Johnson',
    lessons: [
      { id: 1, title: 'Ruby Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/fMyL8Z3tC_s' },
      { id: 2, title: 'Rails MVC', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/fMyL8Z3tC_s' },
      { id: 3, title: 'Authentication & APIs', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/7-1HCWbu7iU' },
      { id: 4, title: 'Deployment & Scaling', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/7-1HCWbu7iU' }
    ]
  },
  {
    id: 65,
    title: 'PHP Programming Fundamentals',
    price: 34.99,
    category: 'Programming',
    totalStudents: 34,
    description: 'Learn PHP programming including syntax, functions, database operations, and building dynamic web applications.',
    instructor: 'David Wilson',
    lessons: [
      { id: 1, title: 'PHP Basics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c' },
      { id: 2, title: 'Functions & Arrays', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c' },
      { id: 3, title: 'Database Operations', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' },
      { id: 4, title: 'Web Applications', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' }
    ]
  },
  {
    id: 66,
    title: 'JavaScript Algorithms & Data Structures',
    price: 49.99,
    category: 'Programming',
    totalStudents: 38,
    description: 'Master algorithms and data structures with JavaScript including Big O notation, sorting, searching, trees, and graphs.',
    instructor: 'Dr. Alan Turing',
    lessons: [
      { id: 1, title: 'Algorithm Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/t2CEgPsws3U' },
      { id: 2, title: 'Sorting & Searching', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/t2CEgPsws3U' },
      { id: 3, title: 'Data Structures', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/3T47VhiV_t4' },
      { id: 4, title: 'Trees & Graphs', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/3T47VhiV_t4' },
      { id: 5, title: 'Advanced Algorithms', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/3T47VhiV_t4' }
    ]
  },
  {
    id: 67,
    title: 'Functional Programming in Scala',
    price: 44.99,
    category: 'Programming',
    totalStudents: 17,
    description: 'Learn functional programming with Scala including immutability, higher-order functions, and building scalable applications.',
    instructor: 'Dr. Martin Odersky',
    lessons: [
      { id: 1, title: 'Scala Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/PiVATxQnNNo' },
      { id: 2, title: 'Functional Programming', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/PiVATxQnNNo' },
      { id: 3, title: 'Data Structures', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/3T47VhiV_t4' },
      { id: 4, title: 'Scala & Big Data', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/3T47VhiV_t4' }
    ]
  },
  {
    id: 68,
    title: 'TypeScript Masterclass',
    price: 39.99,
    category: 'Programming',
    totalStudents: 29,
    description: 'Master TypeScript including types, interfaces, classes, generics, and building type-safe applications with JavaScript.',
    instructor: 'Sarah Chen',
    lessons: [
      { id: 1, title: 'TypeScript Basics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/ahCwqrYpIuM' },
      { id: 2, title: 'Types & Interfaces', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ahCwqrYpIuM' },
      { id: 3, title: 'Classes & Generics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2pZmKW9-I_k' },
      { id: 4, title: 'TypeScript with React', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2pZmKW9-I_k' }
    ]
  },
  {
    id: 69,
    title: 'Dart Programming for Flutter',
    price: 39.99,
    category: 'Programming',
    totalStudents: 26,
    description: 'Learn Dart programming for Flutter development including syntax, OOP, and building cross-platform mobile applications.',
    instructor: 'Dr. Eric Larson',
    lessons: [
      { id: 1, title: 'Dart Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5tqyxO4lDqY' },
      { id: 2, title: 'OOP in Dart', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5tqyxO4lDqY' },
      { id: 3, title: 'Flutter Development', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/1ukSR1GRtMU' },
      { id: 4, title: 'Advanced Dart', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/1ukSR1GRtMU' }
    ]
  },
  {
    id: 70,
    title: 'Elixir & Phoenix Framework',
    price: 44.99,
    category: 'Programming',
    totalStudents: 14,
    description: 'Learn Elixir programming and Phoenix framework for building scalable, fault-tolerant web applications with functional programming.',
    instructor: 'Jose Valim',
    lessons: [
      { id: 1, title: 'Elixir Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/24BMb4mOZRw' },
      { id: 2, title: 'Functional Programming', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/24BMb4mOZRw' },
      { id: 3, title: 'Phoenix Framework', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/ObBVGStQrUU' },
      { id: 4, title: 'Scalable Applications', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ObBVGStQrUU' }
    ]
  },
  {
    id: 71,
    title: 'Perl Programming Basics',
    price: 29.99,
    category: 'Programming',
    totalStudents: 18,
    description: 'Learn Perl programming including syntax, regular expressions, file handling, and building practical scripts and applications.',
    instructor: 'Larry Wall',
    lessons: [
      { id: 1, title: 'Perl Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/WEghIX4D4pg' },
      { id: 2, title: 'Regular Expressions', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/WEghIX4D4pg' },
      { id: 3, title: 'File Handling', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' },
      { id: 4, title: 'Perl Scripts', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' }
    ]
  },
  {
    id: 72,
    title: 'Haskell Functional Programming',
    price: 39.99,
    category: 'Programming',
    totalStudents: 12,
    description: 'Master functional programming with Haskell including pure functions, laziness, and advanced type systems for robust applications.',
    instructor: 'Simon Peyton Jones',
    lessons: [
      { id: 1, title: 'Haskell Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/02_H3LjqMr8' },
      { id: 2, title: 'Pure Functions & Laziness', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/02_H3LjqMr8' },
      { id: 3, title: 'Type Systems', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' },
      { id: 4, title: 'Functional Design', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/6iFiS4gpvoo' }
    ]
  },

  // ========== BUSINESS (18) ==========
  {
    id: 73,
    title: 'Digital Marketing 101',
    price: 29.99,
    category: 'Business',
    totalStudents: 58,
    description: 'Learn digital marketing fundamentals including SEO, social media marketing, email marketing, and content strategy for businesses.',
    instructor: 'Dr. Emma Davis',
    lessons: [
      { id: 1, title: 'Digital Marketing Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'SEO & Content Strategy', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Social Media Marketing', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Email & Analytics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 74,
    title: 'Business Analytics',
    price: 44.99,
    category: 'Business',
    totalStudents: 31,
    description: 'Learn business analytics including data visualization, predictive modeling, and data-driven decision making for organizations.',
    instructor: 'Dr. Robert Wilson',
    lessons: [
      { id: 1, title: 'Business Analytics Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Data Visualization', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Predictive Modeling', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Decision Making', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 75,
    title: 'Entrepreneurship Guide',
    price: 39.99,
    category: 'Business',
    totalStudents: 43,
    description: 'Learn entrepreneurship including business planning, funding, marketing, and building successful startups from concept to scale.',
    instructor: 'Professor Mark Johnson',
    lessons: [
      { id: 1, title: 'Entrepreneurship Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Business Planning', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Funding & Growth', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Marketing & Scaling', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 76,
    title: 'Project Management Professional',
    price: 54.99,
    category: 'Business',
    totalStudents: 26,
    description: 'Learn project management including methodologies, tools, leadership, and best practices for delivering successful projects.',
    instructor: 'Dr. Sarah Thompson',
    lessons: [
      { id: 1, title: 'Project Management Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Methodologies & Tools', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Leadership & Communication', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Best Practices', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 77,
    title: 'Financial Accounting Fundamentals',
    price: 34.99,
    category: 'Business',
    totalStudents: 39,
    description: 'Learn financial accounting including financial statements, balance sheets, income statements, and cash flow analysis.',
    instructor: 'Mr. James Wilson',
    lessons: [
      { id: 1, title: 'Accounting Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Financial Statements', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Analysis & Interpretation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Cash Flow Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 78,
    title: 'Marketing Strategy Mastery',
    price: 44.99,
    category: 'Business',
    totalStudents: 33,
    description: 'Master marketing strategy including market research, segmentation, positioning, and creating effective marketing plans.',
    instructor: 'Dr. Emily Brown',
    lessons: [
      { id: 1, title: 'Marketing Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Market Research', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Segmentation & Positioning', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Marketing Plans', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 79,
    title: 'Leadership & Management',
    price: 49.99,
    category: 'Business',
    totalStudents: 47,
    description: 'Learn leadership and management including leadership styles, team building, decision-making, and organizational culture.',
    instructor: 'Prof. Michael Johnson',
    lessons: [
      { id: 1, title: 'Leadership Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Leadership Styles', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Team Building', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Decision Making', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 80,
    title: 'Business Communication Skills',
    price: 29.99,
    category: 'Business',
    totalStudents: 52,
    description: 'Master business communication including professional writing, presentations, meetings, and effective interpersonal communication.',
    instructor: 'Dr. Lisa Chen',
    lessons: [
      { id: 1, title: 'Business Communication Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Professional Writing', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Presentations & Meetings', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Interpersonal Communication', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 81,
    title: 'Sales Techniques & Strategies',
    price: 34.99,
    category: 'Business',
    totalStudents: 36,
    description: 'Learn professional sales techniques including prospecting, objection handling, closing strategies, and building long-term relationships.',
    instructor: 'Mr. David Miller',
    lessons: [
      { id: 1, title: 'Sales Fundamentals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Prospecting & Qualification', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Closing Strategies', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Relationship Building', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 82,
    title: 'Investment & Stock Market Basics',
    price: 44.99,
    category: 'Business',
    totalStudents: 29,
    description: 'Learn investment fundamentals including stocks, bonds, mutual funds, portfolio management, and financial planning strategies.',
    instructor: 'Dr. Robert Chen',
    lessons: [
      { id: 1, title: 'Investment Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Stocks & Bonds', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Portfolio Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Financial Planning', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 83,
    title: 'Business Law & Ethics',
    price: 39.99,
    category: 'Business',
    totalStudents: 24,
    description: 'Learn business law and ethics including contracts, corporate governance, intellectual property, and ethical decision-making.',
    instructor: 'Prof. Sarah Taylor',
    lessons: [
      { id: 1, title: 'Business Law Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Contracts & Governance', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Intellectual Property', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Ethical Decision Making', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 84,
    title: 'Supply Chain Management',
    price: 44.99,
    category: 'Business',
    totalStudents: 22,
    description: 'Learn supply chain management including logistics, procurement, inventory management, and building efficient supply chains.',
    instructor: 'Dr. Michael Brown',
    lessons: [
      { id: 1, title: 'Supply Chain Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Logistics & Procurement', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Inventory Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Supply Chain Efficiency', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 85,
    title: 'Human Resources Management',
    price: 39.99,
    category: 'Business',
    totalStudents: 31,
    description: 'Learn human resources management including recruitment, training, performance management, and employee relations for organizations.',
    instructor: 'Dr. Emily Davis',
    lessons: [
      { id: 1, title: 'HR Management Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Recruitment & Selection', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Training & Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Employee Relations', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 86,
    title: 'Negotiation Skills Mastery',
    price: 34.99,
    category: 'Business',
    totalStudents: 38,
    description: 'Master negotiation skills including strategies, techniques, and best practices for successful business and personal negotiations.',
    instructor: 'Mr. David Thompson',
    lessons: [
      { id: 1, title: 'Negotiation Fundamentals', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategies & Techniques', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Best Practices', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Real-World Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 87,
    title: 'Business Plan Writing',
    price: 29.99,
    category: 'Business',
    totalStudents: 42,
    description: 'Learn to write comprehensive business plans including market analysis, financial projections, and investor-ready documents.',
    instructor: 'Dr. Sarah Johnson',
    lessons: [
      { id: 1, title: 'Business Plan Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Market Analysis', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Financial Projections', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Investor-Ready Documents', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 88,
    title: 'E-commerce Fundamentals',
    price: 34.99,
    category: 'Business',
    totalStudents: 46,
    description: 'Learn e-commerce fundamentals including platforms, payment gateways, marketing, and strategies for building successful online stores.',
    instructor: 'Mr. James Chen',
    lessons: [
      { id: 1, title: 'E-commerce Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Platforms & Payment Gateways', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'E-commerce Marketing', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Online Stores', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 89,
    title: 'Social Media Marketing',
    price: 29.99,
    category: 'Business',
    totalStudents: 55,
    description: 'Learn social media marketing including strategy development, content creation, analytics, and advertising on major social platforms.',
    instructor: 'Ms. Michelle Lee',
    lessons: [
      { id: 1, title: 'Social Media Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategy & Content Creation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Analytics & Advertising', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 90,
    title: 'SEO & Content Marketing',
    price: 39.99,
    category: 'Business',
    totalStudents: 41,
    description: 'Learn SEO and content marketing including keyword research, on-page optimization, link building, and content strategy for businesses.',
    instructor: 'Mr. John Smith',
    lessons: [
      { id: 1, title: 'SEO & Content Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Keyword Research & Optimization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Link Building & Strategy', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Content Strategy', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== CYBERSECURITY (15) ==========
  {
    id: 91,
    title: 'Cybersecurity Fundamentals',
    price: 49.99,
    category: 'Cybersecurity',
    totalStudents: 34,
    description: 'Learn cybersecurity fundamentals including threats, vulnerabilities, risk management, and security best practices for organizations.',
    instructor: 'Dr. Robert Miller',
    lessons: [
      { id: 1, title: 'Cybersecurity Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Threats & Vulnerabilities', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Risk Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Security Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 92,
    title: 'Ethical Hacking Mastery',
    price: 69.99,
    category: 'Cybersecurity',
    totalStudents: 21,
    description: 'Master ethical hacking including penetration testing, vulnerability assessment, and security tools for network and application security.',
    instructor: 'Mr. James Wilson',
    lessons: [
      { id: 1, title: 'Ethical Hacking Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Penetration Testing', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Vulnerability Assessment', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Security Tools', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 93,
    title: 'Network Security Essentials',
    price: 44.99,
    category: 'Cybersecurity',
    totalStudents: 19,
    description: 'Learn network security including firewalls, intrusion detection, VPNs, and securing network infrastructure against cyber threats.',
    instructor: 'Dr. Sarah Chen',
    lessons: [
      { id: 1, title: 'Network Security Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Firewalls & IDS/IPS', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'VPN & Encryption', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Infrastructure Security', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 94,
    title: 'Cryptography & Encryption',
    price: 39.99,
    category: 'Cybersecurity',
    totalStudents: 27,
    description: 'Learn cryptography including encryption algorithms, digital signatures, PKI, and cryptographic protocols for data protection.',
    instructor: 'Dr. Michael Thompson',
    lessons: [
      { id: 1, title: 'Cryptography Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Encryption Algorithms', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Digital Signatures & PKI', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Cryptographic Protocols', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 95,
    title: 'Penetration Testing Guide',
    price: 54.99,
    category: 'Cybersecurity',
    totalStudents: 18,
    description: 'Learn penetration testing including reconnaissance, exploitation, post-exploitation, and reporting for security assessments.',
    instructor: 'Mr. David Lee',
    lessons: [
      { id: 1, title: 'Penetration Testing Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Reconnaissance & Exploitation', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Post-Exploitation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Reporting & Remediation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 96,
    title: 'Cloud Security Fundamentals',
    price: 49.99,
    category: 'Cybersecurity',
    totalStudents: 23,
    description: 'Learn cloud security including AWS, Azure, and GCP security services, identity management, and securing cloud infrastructure.',
    instructor: 'Dr. Emily Johnson',
    lessons: [
      { id: 1, title: 'Cloud Security Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS Security Services', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Azure & GCP Security', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Identity & Access Management', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 97,
    title: 'Digital Forensics & Investigation',
    price: 44.99,
    category: 'Cybersecurity',
    totalStudents: 16,
    description: 'Learn digital forensics including evidence collection, analysis, investigation techniques, and forensic tools for cyber investigations.',
    instructor: 'Dr. Robert Anderson',
    lessons: [
      { id: 1, title: 'Digital Forensics Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Evidence Collection', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Analysis Techniques', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Forensic Tools', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 98,
    title: 'Security Operations Center (SOC)',
    price: 54.99,
    category: 'Cybersecurity',
    totalStudents: 15,
    description: 'Learn SOC operations including monitoring, incident response, threat intelligence, and security operations best practices.',
    instructor: 'Mr. James Martinez',
    lessons: [
      { id: 1, title: 'SOC Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Monitoring & Detection', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Incident Response', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Threat Intelligence', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 99,
    title: 'Web Application Security',
    price: 44.99,
    category: 'Cybersecurity',
    totalStudents: 25,
    description: 'Learn web application security including OWASP Top 10, authentication, authorization, and securing web applications against attacks.',
    instructor: 'Dr. Sarah Smith',
    lessons: [
      { id: 1, title: 'Web Security Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'OWASP Top 10', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Authentication & Authorization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Securing Web Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 100,
    title: 'Mobile Device Security',
    price: 39.99,
    category: 'Cybersecurity',
    totalStudents: 20,
    description: 'Learn mobile device security including iOS and Android security, mobile threats, and securing mobile applications and devices.',
    instructor: 'Dr. Michael Chen',
    lessons: [
      { id: 1, title: 'Mobile Security Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'iOS & Android Security', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Mobile Threats', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Securing Mobile Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 101,
    title: 'Identity & Access Management',
    price: 44.99,
    category: 'Cybersecurity',
    totalStudents: 22,
    description: 'Learn identity and access management including authentication, authorization, SSO, and IAM best practices for organizations.',
    instructor: 'Dr. Robert Taylor',
    lessons: [
      { id: 1, title: 'IAM Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Authentication & Authorization', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'SSO & Federation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'IAM Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 102,
    title: 'Security Information & Event Management',
    price: 49.99,
    category: 'Cybersecurity',
    totalStudents: 14,
    description: 'Learn SIEM including log management, correlation, security monitoring, and incident detection for security operations centers.',
    instructor: 'Mr. David Kim',
    lessons: [
      { id: 1, title: 'SIEM Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Log Management', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Correlation & Monitoring', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Incident Detection', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 103,
    title: 'Disaster Recovery Planning',
    price: 39.99,
    category: 'Cybersecurity',
    totalStudents: 19,
    description: 'Learn disaster recovery planning including business continuity, backup strategies, and recovery procedures for critical systems.',
    instructor: 'Dr. James Williams',
    lessons: [
      { id: 1, title: 'DR Planning Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Business Continuity', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Backup Strategies', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Recovery Procedures', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 104,
    title: 'Security Risk Assessment',
    price: 44.99,
    category: 'Cybersecurity',
    totalStudents: 21,
    description: 'Learn security risk assessment including risk identification, analysis, evaluation, and mitigation strategies for organizations.',
    instructor: 'Ms. Laura Martinez',
    lessons: [
      { id: 1, title: 'Risk Assessment Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Risk Identification', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Analysis & Evaluation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Mitigation Strategies', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 105,
    title: 'Blockchain Security',
    price: 54.99,
    category: 'Cybersecurity',
    totalStudents: 13,
    description: 'Learn blockchain security including cryptographic foundations, smart contract security, and securing blockchain applications.',
    instructor: 'Dr. Andrew Chen',
    lessons: [
      { id: 1, title: 'Blockchain Security Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Cryptographic Foundations', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Smart Contract Security', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Securing Blockchain Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== MOBILE DEVELOPMENT (15) ==========
  {
    id: 106,
    title: 'Android Development with Kotlin',
    price: 54.99,
    category: 'Mobile Development',
    totalStudents: 29,
    description: 'Learn Android development with Kotlin including layouts, activities, view models, and building production-ready Android apps.',
    instructor: 'Mr. Robert Chen',
    lessons: [
      { id: 1, title: 'Android & Kotlin Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Layouts & Activities', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'View Models & Data Binding', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Android Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 107,
    title: 'iOS Development with Swift',
    price: 59.99,
    category: 'Mobile Development',
    totalStudents: 25,
    description: 'Learn iOS development with Swift including UIKit, SwiftUI, view controllers, and building iOS apps for the Apple ecosystem.',
    instructor: 'Dr. Rachel Kim',
    lessons: [
      { id: 1, title: 'iOS & Swift Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'UIKit & View Controllers', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'SwiftUI Fundamentals', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building iOS Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 108,
    title: 'React Native Cross-Platform',
    price: 49.99,
    category: 'Mobile Development',
    totalStudents: 32,
    description: 'Learn React Native for cross-platform mobile development including components, navigation, state management, and building production apps.',
    instructor: 'Mr. James Park',
    lessons: [
      { id: 1, title: 'React Native Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Components & Styling', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Navigation & State', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building React Native Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 109,
    title: 'Flutter & Dart Mastery',
    price: 49.99,
    category: 'Mobile Development',
    totalStudents: 28,
    description: 'Master Flutter and Dart for cross-platform mobile development including widgets, state management, and beautiful UI design.',
    instructor: 'Dr. Maria Rodriguez',
    lessons: [
      { id: 1, title: 'Flutter & Dart Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Widgets & Layouts', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'State Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Flutter Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 110,
    title: 'Xamarin Mobile Development',
    price: 44.99,
    category: 'Mobile Development',
    totalStudents: 18,
    description: 'Learn Xamarin for cross-platform mobile development including C#, XAML, and building native iOS and Android applications.',
    instructor: 'Mr. David Wilson',
    lessons: [
      { id: 1, title: 'Xamarin Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'C# & XAML', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'iOS & Android Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Xamarin Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 111,
    title: 'Android Java Development',
    price: 44.99,
    category: 'Mobile Development',
    totalStudents: 34,
    description: 'Learn Android development with Java including layouts, activities, and building robust Android applications.',
    instructor: 'Mr. Michael Chen',
    lessons: [
      { id: 1, title: 'Android & Java Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Layouts & Activities', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Data Storage & Services', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Android Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 112,
    title: 'SwiftUI for iOS',
    price: 49.99,
    category: 'Mobile Development',
    totalStudents: 20,
    description: 'Learn SwiftUI for iOS development including declarative UI, state management, and building modern iOS applications.',
    instructor: 'Dr. Emily Johnson',
    lessons: [
      { id: 1, title: 'SwiftUI Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Declarative UI & State', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Navigation & Data', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building iOS Apps', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 113,
    title: 'Ionic Framework Guide',
    price: 39.99,
    category: 'Mobile Development',
    totalStudents: 22,
    description: 'Learn Ionic Framework for hybrid mobile development including Angular, components, and building cross-platform applications.',
    instructor: 'Mr. Robert Taylor',
    lessons: [
      { id: 1, title: 'Ionic Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Angular & Components', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Navigation & Services', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Hybrid Apps', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 114,
    title: 'Mobile App Design',
    price: 44.99,
    category: 'Mobile Development',
    totalStudents: 26,
    description: 'Learn mobile app design principles including iOS and Android patterns, responsive design, and user-centered mobile experiences.',
    instructor: 'Ms. Laura Martinez',
    lessons: [
      { id: 1, title: 'Mobile Design Principles', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'iOS vs Android Patterns', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Responsive Mobile Design', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Mobile UX Best Practices', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 115,
    title: 'Android Jetpack Compose',
    price: 44.99,
    category: 'Mobile Development',
    totalStudents: 19,
    description: 'Learn Android Jetpack Compose including declarative UI, state management, and building modern Android applications.',
    instructor: 'Dr. James Park',
    lessons: [
      { id: 1, title: 'Jetpack Compose Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Declarative UI & State', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Navigation & Data', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Android Apps', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 116,
    title: 'iOS App Development with Objective-C',
    price: 49.99,
    category: 'Mobile Development',
    totalStudents: 15,
    description: 'Learn iOS development with Objective-C including syntax, frameworks, and building iOS applications for the Apple ecosystem.',
    instructor: 'Mr. Steven Chen',
    lessons: [
      { id: 1, title: 'Objective-C & iOS Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Syntax & Frameworks', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'UIKit Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building iOS Apps', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 117,
    title: 'Cross-Platform Mobile Games',
    price: 54.99,
    category: 'Mobile Development',
    totalStudents: 21,
    description: 'Learn cross-platform mobile game development including Unity, game design, and building games for iOS and Android.',
    instructor: 'Mr. David Kim',
    lessons: [
      { id: 1, title: 'Game Development Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Unity Fundamentals', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Game Design & Mechanics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Mobile Games', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 118,
    title: 'Mobile UI/UX Design',
    price: 39.99,
    category: 'Mobile Development',
    totalStudents: 30,
    description: 'Learn mobile UI/UX design including user research, prototyping, and creating beautiful, user-friendly mobile experiences.',
    instructor: 'Ms. Rachel Lee',
    lessons: [
      { id: 1, title: 'Mobile UI/UX Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'User Research & Prototyping', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Design Principles', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Creating Mobile Experiences', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 119,
    title: 'React Native Advanced',
    price: 54.99,
    category: 'Mobile Development',
    totalStudents: 24,
    description: 'Advanced React Native development including performance optimization, native modules, and building complex applications.',
    instructor: 'Mr. James Williams',
    lessons: [
      { id: 1, title: 'Advanced React Native', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Performance Optimization', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Native Modules', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Complex Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 120,
    title: 'Flutter UI Development',
    price: 44.99,
    category: 'Mobile Development',
    totalStudents: 27,
    description: 'Learn Flutter UI development including custom widgets, animations, and creating beautiful cross-platform user interfaces.',
    instructor: 'Dr. Maria Rodriguez',
    lessons: [
      { id: 1, title: 'Flutter UI Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Custom Widgets & Layouts', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Animations & Transitions', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Flutter UIs', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== CLOUD COMPUTING (15) ==========
  {
    id: 121,
    title: 'AWS Cloud Practitioner',
    price: 44.99,
    category: 'Cloud Computing',
    totalStudents: 38,
    description: 'Learn AWS cloud fundamentals including core services, security, architecture, and preparing for AWS Certified Cloud Practitioner exam.',
    instructor: 'Mr. John Smith',
    lessons: [
      { id: 1, title: 'AWS Cloud Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Core AWS Services', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Cloud Security & Architecture', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Exam Preparation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 122,
    title: 'Azure Fundamentals',
    price: 44.99,
    category: 'Cloud Computing',
    totalStudents: 22,
    description: 'Learn Microsoft Azure fundamentals including core services, security, and preparing for Azure certification exams.',
    instructor: 'Ms. Rachel Chen',
    lessons: [
      { id: 1, title: 'Azure Cloud Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Core Azure Services', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Security & Management', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Exam Preparation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 123,
    title: 'Google Cloud Essentials',
    price: 39.99,
    category: 'Cloud Computing',
    totalStudents: 18,
    description: 'Learn Google Cloud Platform fundamentals including core services, security, and preparing for GCP certification exams.',
    instructor: 'Mr. David Kim',
    lessons: [
      { id: 1, title: 'GCP Cloud Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Core GCP Services', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Security & Management', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Exam Preparation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 124,
    title: 'AWS Solutions Architect',
    price: 59.99,
    category: 'Cloud Computing',
    totalStudents: 27,
    description: 'Learn AWS Solutions Architect including architecture design, services, and preparing for AWS Solutions Architect certification.',
    instructor: 'Dr. Robert Johnson',
    lessons: [
      { id: 1, title: 'AWS Architecture Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Design & Services', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Security & Cost Optimization', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Exam Preparation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 125,
    title: 'DevOps with AWS',
    price: 54.99,
    category: 'Cloud Computing',
    totalStudents: 24,
    description: 'Learn DevOps practices on AWS including CI/CD, infrastructure as code, and automating cloud deployments for organizations.',
    instructor: 'Mr. James Martinez',
    lessons: [
      { id: 1, title: 'DevOps & AWS Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'CI/CD Pipelines', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Infrastructure as Code', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Automation & Deployments', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 126,
    title: 'Cloud Security Fundamentals',
    price: 44.99,
    category: 'Cloud Computing',
    totalStudents: 21,
    description: 'Learn cloud security including AWS, Azure, and GCP security services, identity management, and securing cloud infrastructure.',
    instructor: 'Dr. Emily Chen',
    lessons: [
      { id: 1, title: 'Cloud Security Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS & Azure Security', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'GCP & IAM', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Security Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 127,
    title: 'Azure DevOps Guide',
    price: 49.99,
    category: 'Cloud Computing',
    totalStudents: 19,
    description: 'Learn Azure DevOps including CI/CD, version control, and building automated deployment pipelines for cloud applications.',
    instructor: 'Mr. David Wilson',
    lessons: [
      { id: 1, title: 'Azure DevOps Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'CI/CD Pipelines', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Version Control & Automation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Deployment Pipelines', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 128,
    title: 'Google Cloud Architecture',
    price: 54.99,
    category: 'Cloud Computing',
    totalStudents: 16,
    description: 'Learn Google Cloud architecture including design, services, and building scalable cloud applications on GCP.',
    instructor: 'Dr. Robert Kim',
    lessons: [
      { id: 1, title: 'GCP Architecture Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Core GCP Services', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Design & Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Security & Optimization', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 129,
    title: 'AWS Lambda & Serverless',
    price: 49.99,
    category: 'Cloud Computing',
    totalStudents: 23,
    description: 'Learn AWS Lambda and serverless architecture including functions, event-driven design, and building serverless applications.',
    instructor: 'Mr. James Chen',
    lessons: [
      { id: 1, title: 'Serverless Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS Lambda Functions', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Event-Driven Design', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Serverless Apps', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 130,
    title: 'Cloud Migration Strategies',
    price: 44.99,
    category: 'Cloud Computing',
    totalStudents: 20,
    description: 'Learn cloud migration strategies including assessment, planning, execution, and best practices for migrating to the cloud.',
    instructor: 'Dr. Sarah Williams',
    lessons: [
      { id: 1, title: 'Cloud Migration Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Assessment & Planning', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Execution & Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Post-Migration Optimization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 131,
    title: 'Terraform Infrastructure as Code',
    price: 49.99,
    category: 'Cloud Computing',
    totalStudents: 18,
    description: 'Learn Terraform for infrastructure as code including AWS, Azure, and GCP provisioning, and managing cloud infrastructure.',
    instructor: 'Mr. Michael Brown',
    lessons: [
      { id: 1, title: 'Terraform Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'HCL & Providers', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Modules & Provisioning', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Managing Cloud Infrastructure', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 132,
    title: 'Docker & Kubernetes on AWS',
    price: 54.99,
    category: 'Cloud Computing',
    totalStudents: 26,
    description: 'Learn Docker and Kubernetes on AWS including containers, orchestration, and deploying applications on EKS and ECS.',
    instructor: 'Dr. Robert Chen',
    lessons: [
      { id: 1, title: 'Docker & Kubernetes Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Docker Containers', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Kubernetes on AWS', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Deploying Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 133,
    title: 'Cloud Database Management',
    price: 44.99,
    category: 'Cloud Computing',
    totalStudents: 22,
    description: 'Learn cloud database management including AWS RDS, Azure SQL, and GCP Cloud SQL for managing databases in the cloud.',
    instructor: 'Dr. Sarah Kim',
    lessons: [
      { id: 1, title: 'Cloud Databases Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS RDS & Azure SQL', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'GCP Cloud SQL', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Database Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 134,
    title: 'Multi-Cloud Strategy',
    price: 49.99,
    category: 'Cloud Computing',
    totalStudents: 15,
    description: 'Learn multi-cloud strategy including AWS, Azure, and GCP integration, and building resilient cloud applications across providers.',
    instructor: 'Dr. James Park',
    lessons: [
      { id: 1, title: 'Multi-Cloud Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS, Azure & GCP Integration', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Resilient Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Best Practices', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 135,
    title: 'Cloud Cost Optimization',
    price: 39.99,
    category: 'Cloud Computing',
    totalStudents: 19,
    description: 'Learn cloud cost optimization including AWS, Azure, and GCP cost management, and reducing cloud infrastructure costs.',
    instructor: 'Ms. Rachel Lee',
    lessons: [
      { id: 1, title: 'Cloud Cost Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AWS Cost Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Azure & GCP Costs', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Optimization Strategies', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== SOFT SKILLS (15) ==========
  {
    id: 136,
    title: 'Communication Skills Mastery',
    price: 24.99,
    category: 'Soft Skills',
    totalStudents: 62,
    description: 'Master communication skills including active listening, verbal and written communication, and building effective relationships.',
    instructor: 'Dr. Sarah Johnson',
    lessons: [
      { id: 1, title: 'Communication Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Active Listening', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Verbal & Written Communication', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Relationships', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 137,
    title: 'Leadership & Management',
    price: 34.99,
    category: 'Soft Skills',
    totalStudents: 47,
    description: 'Learn leadership and management including leadership styles, team building, decision-making, and organizational culture.',
    instructor: 'Prof. Michael Johnson',
    lessons: [
      { id: 1, title: 'Leadership Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Leadership Styles', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Team Building', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Decision Making', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 138,
    title: 'Public Speaking Excellence',
    price: 29.99,
    category: 'Soft Skills',
    totalStudents: 38,
    description: 'Learn public speaking including presentation skills, confidence building, and techniques for engaging and persuasive speaking.',
    instructor: 'Ms. Rachel Lee',
    lessons: [
      { id: 1, title: 'Public Speaking Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Presentation Skills', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Confidence Building', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Engaging Presentations', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 139,
    title: 'Time Management & Productivity',
    price: 19.99,
    category: 'Soft Skills',
    totalStudents: 55,
    description: 'Learn time management and productivity techniques including prioritization, goal setting, and effective daily habits.',
    instructor: 'Mr. James Wilson',
    lessons: [
      { id: 1, title: 'Time Management Overview', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Prioritization & Goals', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Daily Habits', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Productivity Techniques', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 140,
    title: 'Emotional Intelligence',
    price: 29.99,
    category: 'Soft Skills',
    totalStudents: 41,
    description: 'Learn emotional intelligence including self-awareness, empathy, and social skills for personal and professional success.',
    instructor: 'Dr. Emily Davis',
    lessons: [
      { id: 1, title: 'Emotional Intelligence Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Self-Awareness & Empathy', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Social Skills', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Emotional Intelligence at Work', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 141,
    title: 'Critical Thinking & Problem Solving',
    price: 34.99,
    category: 'Soft Skills',
    totalStudents: 37,
    description: 'Learn critical thinking and problem solving including analysis, decision making, and creative solutions for complex problems.',
    instructor: 'Dr. Robert Thompson',
    lessons: [
      { id: 1, title: 'Critical Thinking Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Analysis & Decision Making', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Creative Solutions', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Problem Solving Techniques', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 142,
    title: 'Team Collaboration Skills',
    price: 24.99,
    category: 'Soft Skills',
    totalStudents: 44,
    description: 'Learn team collaboration including communication, conflict resolution, and building effective team relationships.',
    instructor: 'Ms. Laura Martinez',
    lessons: [
      { id: 1, title: 'Team Collaboration Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Communication & Conflict Resolution', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Team Relationships', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Effective Collaboration', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 143,
    title: 'Conflict Resolution Mastery',
    price: 29.99,
    category: 'Soft Skills',
    totalStudents: 33,
    description: 'Master conflict resolution including strategies, techniques, and building consensus for successful resolution outcomes.',
    instructor: 'Dr. Sarah Chen',
    lessons: [
      { id: 1, title: 'Conflict Resolution Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategies & Techniques', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Consensus', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Successful Resolution', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 144,
    title: 'Negotiation & Persuasion',
    price: 34.99,
    category: 'Soft Skills',
    totalStudents: 29,
    description: 'Learn negotiation and persuasion including strategies, techniques, and building effective negotiation outcomes.',
    instructor: 'Mr. David Kim',
    lessons: [
      { id: 1, title: 'Negotiation Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategies & Techniques', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Persuasion Skills', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Effective Negotiation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 145,
    title: 'Creative Thinking & Innovation',
    price: 29.99,
    category: 'Soft Skills',
    totalStudents: 36,
    description: 'Learn creative thinking and innovation including techniques, process, and building creative solutions for organizations.',
    instructor: 'Dr. Robert Lee',
    lessons: [
      { id: 1, title: 'Creative Thinking Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Techniques & Process', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Creative Solutions', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Innovation & Implementation', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 146,
    title: 'Work-Life Balance Strategies',
    price: 24.99,
    category: 'Soft Skills',
    totalStudents: 42,
    description: 'Learn work-life balance strategies including time management, stress reduction, and building healthy personal and professional lives.',
    instructor: 'Ms. Emily Brown',
    lessons: [
      { id: 1, title: 'Work-Life Balance Overview', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Time Management & Stress Reduction', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Healthy Lives', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Strategies for Success', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 147,
    title: 'Stress Management Techniques',
    price: 19.99,
    category: 'Soft Skills',
    totalStudents: 48,
    description: 'Learn stress management techniques including mindfulness, relaxation, and building resilience for personal and professional well-being.',
    instructor: 'Dr. Sarah Thompson',
    lessons: [
      { id: 1, title: 'Stress Management Overview', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Mindfulness & Relaxation', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Resilience', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Techniques for Well-Being', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 148,
    title: 'Interpersonal Skills Development',
    price: 24.99,
    category: 'Soft Skills',
    totalStudents: 39,
    description: 'Develop interpersonal skills including communication, empathy, and building effective relationships in personal and professional settings.',
    instructor: 'Ms. Laura Chen',
    lessons: [
      { id: 1, title: 'Interpersonal Skills Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Communication & Empathy', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Relationships', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Effective Interpersonal Skills', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 149,
    title: 'Goal Setting & Achievement',
    price: 19.99,
    category: 'Soft Skills',
    totalStudents: 51,
    description: 'Learn goal setting and achievement including strategies, planning, and building habits for personal and professional success.',
    instructor: 'Mr. James Park',
    lessons: [
      { id: 1, title: 'Goal Setting Overview', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategies & Planning', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Habits', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Achieving Success', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 150,
    title: 'Career Development & Networking',
    price: 29.99,
    category: 'Soft Skills',
    totalStudents: 34,
    description: 'Learn career development and networking including strategies, building professional networks, and achieving career goals.',
    instructor: 'Dr. Michael Brown',
    lessons: [
      { id: 1, title: 'Career Development Overview', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Networking Strategies', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Professional Networks', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Achieving Career Goals', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== DATABASE (15) ==========
  {
    id: 151,
    title: 'Database Design & Management',
    price: 39.99,
    category: 'Database',
    totalStudents: 33,
    description: 'Learn database design and management including normalization, ER modeling, and building efficient database systems.',
    instructor: 'Dr. Robert Smith',
    lessons: [
      { id: 1, title: 'Database Design Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Normalization & ER Modeling', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Database Management', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Efficient Database Systems', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 152,
    title: 'Advanced SQL Queries',
    price: 44.99,
    category: 'Database',
    totalStudents: 27,
    description: 'Learn advanced SQL queries including complex joins, subqueries, window functions, and performance optimization techniques.',
    instructor: 'Ms. Sarah Chen',
    lessons: [
      { id: 1, title: 'Advanced SQL Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Complex Joins & Subqueries', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Window Functions', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Performance Optimization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 153,
    title: 'MongoDB Developer Guide',
    price: 44.99,
    category: 'Database',
    totalStudents: 21,
    description: 'Learn MongoDB development including document modeling, aggregation, and building scalable NoSQL database applications.',
    instructor: 'Mr. David Kim',
    lessons: [
      { id: 1, title: 'MongoDB Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Document Modeling', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Aggregation & Queries', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Scalable Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 154,
    title: 'PostgreSQL Mastery',
    price: 44.99,
    category: 'Database',
    totalStudents: 25,
    description: 'Master PostgreSQL including advanced queries, performance optimization, and building robust database applications.',
    instructor: 'Dr. Michael Chen',
    lessons: [
      { id: 1, title: 'PostgreSQL Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Advanced Queries', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Performance Optimization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Robust Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 155,
    title: 'MySQL Performance Tuning',
    price: 39.99,
    category: 'Database',
    totalStudents: 29,
    description: 'Learn MySQL performance tuning including query optimization, indexing, and database configuration for high-performance systems.',
    instructor: 'Mr. James Wilson',
    lessons: [
      { id: 1, title: 'MySQL Performance Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Query Optimization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Indexing Strategies', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'High-Performance Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 156,
    title: 'NoSQL Database Essentials',
    price: 34.99,
    category: 'Database',
    totalStudents: 23,
    description: 'Learn NoSQL database essentials including document, key-value, and column-family databases for modern applications.',
    instructor: 'Dr. Emily Lee',
    lessons: [
      { id: 1, title: 'NoSQL Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Document & Key-Value Databases', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Column-Family Databases', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Modern Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 157,
    title: 'Oracle Database Administration',
    price: 49.99,
    category: 'Database',
    totalStudents: 18,
    description: 'Learn Oracle Database Administration including installation, configuration, backup, and recovery for enterprise systems.',
    instructor: 'Mr. Robert Taylor',
    lessons: [
      { id: 1, title: 'Oracle DBA Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Installation & Configuration', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Backup & Recovery', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Enterprise Systems', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 158,
    title: 'Redis & Caching Strategies',
    price: 39.99,
    category: 'Database',
    totalStudents: 20,
    description: 'Learn Redis and caching strategies including data structures, performance optimization, and building scalable applications.',
    instructor: 'Ms. Rachel Kim',
    lessons: [
      { id: 1, title: 'Redis & Caching Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Data Structures', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Performance Optimization', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Scalable Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 159,
    title: 'Elasticsearch Guide',
    price: 44.99,
    category: 'Database',
    totalStudents: 16,
    description: 'Learn Elasticsearch including indexing, searching, and analytics for building powerful search and data analysis applications.',
    instructor: 'Mr. David Chen',
    lessons: [
      { id: 1, title: 'Elasticsearch Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Indexing & Searching', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Analytics & Visualization', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Powerful Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 160,
    title: 'Cassandra Database Fundamentals',
    price: 39.99,
    category: 'Database',
    totalStudents: 14,
    description: 'Learn Cassandra database fundamentals including architecture, data modeling, and building scalable NoSQL applications.',
    instructor: 'Dr. Sarah Lee',
    lessons: [
      { id: 1, title: 'Cassandra Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Architecture & Data Modeling', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Scalable Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'NoSQL Development', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 161,
    title: 'Database Security Best Practices',
    price: 44.99,
    category: 'Database',
    totalStudents: 22,
    description: 'Learn database security best practices including authentication, authorization, encryption, and securing database systems.',
    instructor: 'Mr. James Park',
    lessons: [
      { id: 1, title: 'Database Security Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Authentication & Authorization', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Encryption & Security', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Securing Database Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 162,
    title: 'Data Warehousing Concepts',
    price: 44.99,
    category: 'Database',
    totalStudents: 19,
    description: 'Learn data warehousing concepts including architecture, ETL, and building business intelligence solutions for organizations.',
    instructor: 'Dr. Michael Brown',
    lessons: [
      { id: 1, title: 'Data Warehousing Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Architecture & ETL', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Business Intelligence', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building BI Solutions', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 163,
    title: 'ETL & Data Integration',
    price: 39.99,
    category: 'Database',
    totalStudents: 21,
    description: 'Learn ETL and data integration including extraction, transformation, and loading data for business intelligence and analytics.',
    instructor: 'Ms. Emily Wilson',
    lessons: [
      { id: 1, title: 'ETL & Data Integration Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Extraction & Transformation', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Loading Data', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Business Intelligence', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 164,
    title: 'SQL Server Development',
    price: 44.99,
    category: 'Database',
    totalStudents: 24,
    description: 'Learn SQL Server development including T-SQL, stored procedures, and building database applications for Microsoft platforms.',
    instructor: 'Mr. David Wilson',
    lessons: [
      { id: 1, title: 'SQL Server Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'T-SQL & Stored Procedures', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Database Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Microsoft Platforms', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 165,
    title: 'Database Backup & Recovery',
    price: 34.99,
    category: 'Database',
    totalStudents: 26,
    description: 'Learn database backup and recovery including strategies, techniques, and disaster recovery for database systems.',
    instructor: 'Dr. Robert Kim',
    lessons: [
      { id: 1, title: 'Backup & Recovery Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategies & Techniques', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Disaster Recovery', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Database Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },

  // ========== ARTIFICIAL INTELLIGENCE (15) ==========
  {
    id: 166,
    title: 'AI for Beginners',
    price: 39.99,
    category: 'Artificial Intelligence',
    totalStudents: 45,
    description: 'Learn artificial intelligence basics including concepts, applications, and building simple AI systems for beginners.',
    instructor: 'Dr. Sarah Johnson',
    lessons: [
      { id: 1, title: 'AI Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'AI Concepts & Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building Simple AI Systems', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'AI for Beginners', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 167,
    title: 'Natural Language Processing',
    price: 59.99,
    category: 'Artificial Intelligence',
    totalStudents: 18,
    description: 'Master natural language processing including text preprocessing, sentiment analysis, transformers, and building NLP applications.',
    instructor: 'Dr. Alex Wang',
    lessons: [
      { id: 1, title: 'NLP Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/CMrHM8a3hqw' },
      { id: 2, title: 'Text Preprocessing & Sentiment Analysis', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/8Q9TPx5zVY0' },
      { id: 3, title: 'Transformers & BERT', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/1J2i3PGz6eM' },
      { id: 4, title: 'Building NLP Applications', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/5jZ1KBaFYkY' }
    ]
  },
  {
    id: 168,
    title: 'Computer Vision with Python',
    price: 64.99,
    category: 'Artificial Intelligence',
    totalStudents: 15,
    description: 'Learn computer vision with Python including image processing, object detection, and building CV applications with deep learning.',
    instructor: 'Dr. Lisa Chen',
    lessons: [
      { id: 1, title: 'CV Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/VwVg9jCtqaU' },
      { id: 2, title: 'Image Processing', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/0y7h_oA8eHw' },
      { id: 3, title: 'Object Detection', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/ArPaAX_PhIs' },
      { id: 4, title: 'Deep Learning for CV', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/YRhxdVk_sIs' }
    ]
  },
  {
    id: 169,
    title: 'Generative AI & ChatGPT',
    price: 49.99,
    category: 'Artificial Intelligence',
    totalStudents: 34,
    description: 'Learn generative AI and ChatGPT including concepts, applications, and building AI applications with OpenAI technologies.',
    instructor: 'Dr. Emily Johnson',
    lessons: [
      { id: 1, title: 'Generative AI Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'ChatGPT & OpenAI', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building AI Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Generative AI Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 170,
    title: 'Reinforcement Learning',
    price: 54.99,
    category: 'Artificial Intelligence',
    totalStudents: 13,
    description: 'Learn reinforcement learning including concepts, algorithms, and building RL applications for game AI and robotics.',
    instructor: 'Dr. James Park',
    lessons: [
      { id: 1, title: 'Reinforcement Learning Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Algorithms & Concepts', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Game AI & Robotics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building RL Applications', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 171,
    title: 'Deep Learning with TensorFlow',
    price: 69.99,
    category: 'Artificial Intelligence',
    totalStudents: 22,
    description: 'Master deep learning with TensorFlow including neural networks, CNNs, and building advanced AI applications.',
    instructor: 'Dr. Martin Chen',
    lessons: [
      { id: 1, title: 'Deep Learning Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk' },
      { id: 2, title: 'Neural Networks', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk' },
      { id: 3, title: 'CNNs & Deep Learning', duration: '60:00', videoUrl: 'https://www.youtube.com/embed/EWWn3x0q3vs' },
      { id: 4, title: 'Advanced AI Applications', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/f_u2lFqzjM4' }
    ]
  },
  {
    id: 172,
    title: 'PyTorch for AI',
    price: 59.99,
    category: 'Artificial Intelligence',
    totalStudents: 19,
    description: 'Learn PyTorch for AI including dynamic computation graphs, neural networks, and building production-ready AI models.',
    instructor: 'Dr. Sarah Kim',
    lessons: [
      { id: 1, title: 'PyTorch Overview', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/XfY3H-IfpRg' },
      { id: 2, title: 'Neural Networks', duration: '55:00', videoUrl: 'https://www.youtube.com/embed/XfY3H-IfpRg' },
      { id: 3, title: 'Advanced PyTorch', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/ISXyRjRhYfE' },
      { id: 4, title: 'Production-Ready AI Models', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/0a5y4oKv7qg' }
    ]
  },
  {
    id: 173,
    title: 'AI Ethics & Responsible AI',
    price: 34.99,
    category: 'Artificial Intelligence',
    totalStudents: 27,
    description: 'Learn AI ethics and responsible AI including bias, fairness, transparency, and building ethical AI systems.',
    instructor: 'Dr. Rachel Lee',
    lessons: [
      { id: 1, title: 'AI Ethics Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Bias & Fairness', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Transparency & Ethics', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Ethical AI', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 174,
    title: 'Machine Learning Ops (MLOps)',
    price: 49.99,
    category: 'Artificial Intelligence',
    totalStudents: 16,
    description: 'Learn MLOps including deployment, monitoring, and scaling machine learning models in production environments.',
    instructor: 'Mr. James Chen',
    lessons: [
      { id: 1, title: 'MLOps Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Deployment & Monitoring', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Scaling ML Models', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Production Environments', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 175,
    title: 'AI for Healthcare',
    price: 44.99,
    category: 'Artificial Intelligence',
    totalStudents: 21,
    description: 'Learn AI applications in healthcare including medical imaging, diagnostics, and building AI systems for healthcare.',
    instructor: 'Dr. Robert Wilson',
    lessons: [
      { id: 1, title: 'AI in Healthcare Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Medical Imaging & Diagnostics', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'AI Systems for Healthcare', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Healthcare Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 176,
    title: 'AI for Finance',
    price: 44.99,
    category: 'Artificial Intelligence',
    totalStudents: 18,
    description: 'Learn AI applications in finance including fraud detection, algorithmic trading, and building AI systems for financial services.',
    instructor: 'Ms. Emily Davis',
    lessons: [
      { id: 1, title: 'AI in Finance Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Fraud Detection & Trading', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'AI Systems for Finance', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Financial Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 177,
    title: 'Neural Networks Architecture',
    price: 54.99,
    category: 'Artificial Intelligence',
    totalStudents: 24,
    description: 'Learn neural networks architecture including design patterns, optimization, and building scalable neural network systems.',
    instructor: 'Dr. Michael Brown',
    lessons: [
      { id: 1, title: 'Neural Networks Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Design Patterns & Optimization', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Scalable Systems', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Neural Networks', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 178,
    title: 'AI Image Recognition',
    price: 49.99,
    category: 'Artificial Intelligence',
    totalStudents: 20,
    description: 'Learn AI image recognition including CNNs, transfer learning, and building AI applications for image classification and detection.',
    instructor: 'Dr. Sarah Kim',
    lessons: [
      { id: 1, title: 'Image Recognition Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'CNNs & Transfer Learning', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Image Classification', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'AI Image Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 179,
    title: 'Speech Recognition & Processing',
    price: 54.99,
    category: 'Artificial Intelligence',
    totalStudents: 14,
    description: 'Learn speech recognition and processing including audio preprocessing, ASR models, and building speech applications.',
    instructor: 'Dr. David Chen',
    lessons: [
      { id: 1, title: 'Speech Recognition Overview', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Audio Preprocessing & ASR Models', duration: '50:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Speech Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Building Speech Systems', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
  {
    id: 180,
    title: 'AI Product Development',
    price: 44.99,
    category: 'Artificial Intelligence',
    totalStudents: 17,
    description: 'Learn AI product development including strategy, design, and building AI-powered products for the market.',
    instructor: 'Mr. James Lee',
    lessons: [
      { id: 1, title: 'AI Product Overview', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 2, title: 'Strategy & Design', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/2LksZ7Y7mHw' },
      { id: 3, title: 'Building AI Products', duration: '40:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' },
      { id: 4, title: 'Market Applications', duration: '45:00', videoUrl: 'https://www.youtube.com/embed/5f6c_7w0pZk' }
    ]
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Get or create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@studybuddy.com' },
    update: {},
    create: {
      email: 'admin@studybuddy.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Admin user ready:', admin.email);

  // Loop through all courses
  for (const c of coursesData) {
    const slug = slugify(c.title);

    const course = await prisma.course.upsert({
      where: { slug },
      update: {
        title: c.title,
        description: c.description,
        price: c.price,
        category: c.category,
        instructorName: c.instructor || 'Admin User',
        totalStudents: c.totalStudents || 0,
        isPublished: true,
      },
      create: {
        slug,
        title: c.title,
        description: c.description,
        price: c.price,
        category: c.category,
        instructorId: admin.id,
        instructorName: c.instructor || 'Admin User',
        level: 'BEGINNER',
        isPublished: true,
        totalStudents: c.totalStudents || 0,
      },
    });

    // Add lessons
    for (const lesson of c.lessons) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          duration: parseDuration(lesson.duration),
          displayOrder: lesson.id,
          status: 'PUBLISHED',
        },
        create: {
          id: lesson.id,
          courseId: course.id,
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          duration: parseDuration(lesson.duration),
          displayOrder: lesson.id,
          status: 'PUBLISHED',
        },
      });
    }

    console.log(`✅ Course ${c.id}: ${c.title} (${c.lessons.length} lessons)`);
  }

  const courseCount = await prisma.course.count();
  const lessonCount = await prisma.lesson.count();
  console.log(`🌱 Seeding complete! ${courseCount} courses, ${lessonCount} lessons.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });