const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

const emailController = new EmailController();

// Apply authentication middleware to all email routes
router.use(authMiddleware);

// POST /api/emails/read - Read and save user's emails
router.post('/read', (req, res) => emailController.readUserEmails(req, res));

// GET /api/emails - Get user's emails
router.get('/', (req, res) => emailController.getUserEmails(req, res));

// GET /api/emails/top - Get top emails (default: 5)
router.get('/top', (req, res) => emailController.getTopEmails(req, res));

// GET /api/emails/stats - Get email statistics
router.get('/stats', (req, res) => emailController.getEmailStats(req, res));

// PUT /api/emails/:emailId/relevance - Update email relevance
router.put('/:emailId/relevance', (req, res) => emailController.updateEmailRelevance(req, res));

// DELETE /api/emails/cleanup - Cleanup old emails
router.delete('/cleanup', (req, res) => emailController.cleanupOldEmails(req, res));

module.exports = router;
