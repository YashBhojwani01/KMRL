const express = require('express');
const router = express.Router();
const AttachmentController = require('../controllers/attachmentController');
const authMiddleware = require('../middleware/authMiddleware');

const attachmentController = new AttachmentController();

// Apply authentication middleware to all attachment routes
router.use(authMiddleware);

// GET /api/attachments/email/:emailId - Get all attachments for a specific email
router.get('/email/:emailId', (req, res) => attachmentController.getEmailAttachments(req, res));

// GET /api/attachments/:attachmentId - Get specific attachment details
router.get('/:attachmentId', (req, res) => attachmentController.getAttachmentById(req, res));

// GET /api/attachments/search - Search attachments by content
router.get('/search', (req, res) => attachmentController.searchAttachments(req, res));

// GET /api/attachments/stats - Get attachment statistics
router.get('/stats', (req, res) => attachmentController.getAttachmentStats(req, res));

// GET /api/attachments/:attachmentId/download - Download attachment
router.get('/:attachmentId/download', (req, res) => attachmentController.downloadAttachment(req, res));

module.exports = router;
