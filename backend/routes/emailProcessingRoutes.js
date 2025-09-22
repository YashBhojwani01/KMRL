const express = require('express');
const router = express.Router();
const EmailProcessingController = require('../controllers/emailProcessingController');
const authMiddleware = require('../middleware/authMiddleware');

const emailProcessingController = new EmailProcessingController();

// Apply authentication middleware to all email processing routes
router.use(authMiddleware);

// POST /api/email-processing/process - Process and classify user emails
router.post('/process', (req, res) => emailProcessingController.processUserEmails(req, res));

// GET /api/email-processing/relevant-dataframe - Get relevant emails as DataFrame
router.get('/relevant-dataframe', (req, res) => emailProcessingController.getRelevantEmailsDataFrame(req, res));

// GET /api/email-processing/classification-report - Get classification report
router.get('/classification-report', (req, res) => emailProcessingController.getClassificationReport(req, res));

// POST /api/email-processing/classify/:emailId - Classify a single email
router.post('/classify/:emailId', (req, res) => emailProcessingController.classifySingleEmail(req, res));

// POST /api/email-processing/cleanup - Cleanup temp files
router.post('/cleanup', (req, res) => emailProcessingController.cleanupTempFiles(req, res));

// GET /api/email-processing/temp-stats - Get temp storage statistics
router.get('/temp-stats', (req, res) => emailProcessingController.getTempStorageStats(req, res));

module.exports = router;
