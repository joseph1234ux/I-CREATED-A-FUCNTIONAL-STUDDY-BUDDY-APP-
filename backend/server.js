const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here_change_this';
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// ===== PAYMENT IDEMPOTENCY =====
let processedTransactions = new Set();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== HELPERS =====
function formatCourseForResponse(course) {
  const lessons = (course.lessons || [])
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}` : '00:00',
      videoUrl: lesson.videoUrl || '',
    }));

  let totalMinutes = 0;
  if (course.lessons) {
    for (const l of course.lessons) {
      if (l.duration) totalMinutes += Math.floor(l.duration / 60);
    }
  }
  const duration = totalMinutes > 0 ? `${totalMinutes} hours` : '10 hours';

  return {
    id: course.id,
    title: course.title,
    price: course.price,
    category: course.category,
    totalStudents: course.totalStudents,
    description: course.description,
    instructor: course.instructorName,
    duration: duration,
    lessons: lessons,
    rating: course.rating || 0,
  };
}

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: role ? role.toUpperCase() : 'STUDENT',
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ===== MIDDLEWARE =====
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// =============================================
// ===== ⭐ COURSE ROUTES =====
// =============================================

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(courses.map(formatCourseForResponse));
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        lessons: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(formatCourseForResponse(course));
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/courses', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, price, category } = req.body;
    if (!title || price === undefined || !category) {
      return res.status(400).json({ message: 'Please provide title, price, and category' });
    }

    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const newCourse = await prisma.course.create({
      data: {
        title: title.trim(),
        slug: slug + '-' + Date.now(),
        price: parseFloat(price),
        category: category.trim(),
        instructorId: req.user.id,
        instructorName: 'Instructor',
        description: 'New course description',
        level: 'BEGINNER',
        isPublished: true,
      },
    });
    res.status(201).json(formatCourseForResponse(newCourse));
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// ===== ⭐ REVIEWS ROUTES =====
// =============================================

app.get('/api/courses/:id/reviews', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const reviews = await prisma.review.findMany({
      where: { courseId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/courses/:id/reviews', authenticate, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a rating between 1 and 5' });
    }
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Please provide a comment (minimum 3 characters)' });
    }

    const existingReview = await prisma.review.findUnique({
      where: { userId_courseId: { userId: req.user.id, courseId } },
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this course' });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: req.user.id,
        courseId,
        rating,
        comment: comment.trim(),
      },
    });

    // Update course average rating
    const allReviews = await prisma.review.findMany({ where: { courseId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.course.update({
      where: { id: courseId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    res.status(201).json({
      message: 'Review added successfully!',
      review: newReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/reviews/:id', authenticate, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (comment && comment.trim().length < 3) {
      return res.status(400).json({ message: 'Comment must be at least 3 characters' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating && { rating }),
        ...(comment && { comment: comment.trim() }),
      },
    });

    // Update course average rating
    const allReviews = await prisma.review.findMany({ where: { courseId: review.courseId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.course.update({
      where: { id: review.courseId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    res.json({ message: 'Review updated successfully!', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/reviews/:id', authenticate, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    // Update course average rating
    const allReviews = await prisma.review.findMany({ where: { courseId: review.courseId } });
    const avgRating = allReviews.length === 0 
      ? 0 
      : Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10;
    await prisma.course.update({
      where: { id: review.courseId },
      data: { rating: avgRating },
    });

    res.json({ message: 'Review deleted successfully!' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// ===== ENROLLMENT ROUTES =====
// =============================================

app.post('/api/courses/:id/enroll', authenticate, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    await prisma.courseEnrollment.create({
      data: { userId, courseId, progressPercentage: 0, isCompleted: false },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { totalStudents: { increment: 1 } },
    });

    res.status(201).json({ message: 'Successfully enrolled in course!' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/enrollments', authenticate, async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: req.user.id },
      include: { course: { include: { lessons: true } } },
    });
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/enrollments/:id/progress', authenticate, async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);
    const { progress } = req.body;

    const enrollment = await prisma.courseEnrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const newProgress = Math.min(100, Math.max(0, progress));
    const isCompleted = newProgress === 100;

    const updated = await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        progressPercentage: newProgress,
        isCompleted,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
    });

    res.json({
      message: 'Progress updated',
      enrollment: {
        id: updated.id,
        userId: updated.userId,
        courseId: updated.courseId,
        enrolledAt: updated.enrolledAt.toISOString(),
        progress: updated.progressPercentage,
        completed: updated.isCompleted,
      },
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// ===== 💳 PAYMENT ROUTES (Paystack) =====
// =============================================

// Initialize Payment
app.post('/api/payments/initialize', authenticate, async (req, res) => {
  try {
    const { amount, courseId, courseTitle } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    const amountInKobo = Math.round(amount * 100);

    console.log('🔐 Initializing payment:', {
      email: userEmail,
      amount: amountInKobo,
      courseId,
      courseTitle,
    });

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: userEmail,
        amount: amountInKobo,
        currency: 'NGN',
        callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/payment-success',
        metadata: {
          user_id: userId,
          course_id: courseId,
          course_title: courseTitle,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Payment initialized:', {
      reference: response.data.data.reference,
    });

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('❌ Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to initialize payment',
      error: error.response?.data?.message || error.message,
    });
  }
});

// Verify Payment
app.get('/api/payments/verify/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user.id;

    console.log('🔍 Verifying payment:', reference);

    if (processedTransactions.has(reference)) {
      return res.json({
        success: true,
        message: 'Payment already verified and enrolled',
        alreadyProcessed: true,
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const transaction = response.data.data;
    const metadata = transaction.metadata || {};

    console.log('📊 Transaction status:', {
      reference: transaction.reference,
      status: transaction.status,
    });

    if (transaction.status === 'success') {
      processedTransactions.add(reference);

      const courseId = parseInt(metadata.course_id);

      const existingEnrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!existingEnrollment) {
        await prisma.courseEnrollment.create({
          data: {
            userId,
            courseId,
            progressPercentage: 0,
            isCompleted: false,
            paymentReference: reference,
            amountPaid: transaction.amount / 100,
          },
        });

        await prisma.course.update({
          where: { id: courseId },
          data: { totalStudents: { increment: 1 } },
        });

        console.log('✅ User enrolled via payment:', { userId, courseId, reference });
      }

      // Record payment
      try {
        await prisma.payment.create({
          data: {
            userId,
            courseId,
            reference,
            amount: transaction.amount / 100,
            currency: 'NGN',
            status: 'SUCCESS',
            paidAt: new Date(),
            metadata: metadata,
          },
        });
      } catch (paymentError) {
        console.log('Payment record may already exist');
      }

      res.json({
        success: true,
        message: 'Payment verified and enrollment successful!',
        transaction: transaction,
        enrolled: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: transaction.status,
      });
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to verify payment',
      error: error.response?.data?.message || error.message,
    });
  }
});

// Webhook
app.post('/api/payments/webhook', async (req, res) => {
  const event = req.body;
  console.log('📨 Webhook received:', event.event);

  if (event.event === 'charge.success') {
    const transaction = event.data;
    const metadata = transaction.metadata || {};
    const reference = transaction.reference;

    console.log('✅ Webhook: Charge successful', {
      reference,
      courseId: metadata.course_id,
      userId: metadata.user_id,
    });

    if (processedTransactions.has(reference)) {
      return res.sendStatus(200);
    }

    const userId = parseInt(metadata.user_id);
    const courseId = parseInt(metadata.course_id);

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    }).catch(() => null);

    if (!existingEnrollment) {
      await prisma.courseEnrollment.create({
        data: {
          userId,
          courseId,
          progressPercentage: 0,
          isCompleted: false,
          paymentReference: reference,
          amountPaid: transaction.amount / 100,
        },
      });

      await prisma.course.update({
        where: { id: courseId },
        data: { totalStudents: { increment: 1 } },
      });

      processedTransactions.add(reference);

      console.log('✅ Webhook: User enrolled', { userId, courseId, reference });
    }
  }

  res.sendStatus(200);
});

// =============================================
// ===== HEALTH =====
// =============================================

app.get('/api/health', async (req, res) => {
  try {
    const courseCount = await prisma.course.count();
    const userCount = await prisma.user.count();
    res.json({
      status: 'OK',
      message: 'Backend is running!',
      timestamp: new Date().toISOString(),
      courses: courseCount,
      users: userCount,
      payments: processedTransactions.size,
    });
  } catch (error) {
    res.json({
      status: 'OK',
      message: 'Backend is running!',
      timestamp: new Date().toISOString(),
    });
  }
});

// =============================================
// ===== ERROR HANDLER =====
// =============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`👤 Test user: admin@studybuddy.com / admin123`);
  console.log(`💳 Payment routes enabled!`);
});