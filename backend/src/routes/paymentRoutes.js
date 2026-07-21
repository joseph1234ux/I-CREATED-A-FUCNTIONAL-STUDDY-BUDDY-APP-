const express = require('express');
const router = express.Router();
const axios = require('axios');

// ===== PAYSTACK SECRET KEY =====
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// ===== INITIALIZE PAYMENT =====
router.post('/initialize', async (req, res) => {
  try {
    const { amount, courseId, courseTitle } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;

    const amountInKobo = Math.round(amount * 100);

    console.log('🔐 Initializing payment:', {
      email: userEmail,
      amount: amountInKobo,
      courseId,
      courseTitle
    });

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: userEmail,
        amount: amountInKobo,
        currency: 'NGN',
        callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5174/payment-success',
        metadata: {
          user_id: userId,
          user_name: userName,
          course_id: courseId,
          course_title: courseTitle
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Payment initialized:', {
      reference: response.data.data.reference
    });

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });

  } catch (error) {
    console.error('❌ Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to initialize payment',
      error: error.response?.data?.message || error.message
    });
  }
});

// ===== VERIFY PAYMENT =====
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    console.log('🔍 Verifying payment:', reference);

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`
        }
      }
    );

    const transaction = response.data.data;
    const metadata = transaction.metadata || {};

    console.log('📊 Transaction status:', {
      reference: transaction.reference,
      status: transaction.status
    });

    if (transaction.status === 'success') {
      res.json({
        success: true,
        message: 'Payment verified successfully!',
        transaction: transaction
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: transaction.status
      });
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to verify payment',
      error: error.response?.data?.message || error.message
    });
  }
});

// ===== WEBHOOK =====
router.post('/webhook', async (req, res) => {
  const event = req.body;
  console.log('📨 Webhook received:', event.event);
  res.sendStatus(200);
});

module.exports = router;
