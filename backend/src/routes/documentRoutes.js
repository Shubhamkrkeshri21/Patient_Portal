const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const DocumentController = require('../controllers/documentController');

// Upload document
router.post('/upload', upload.single('file'), DocumentController.uploadDocument);

// Get all documents
router.get('/', DocumentController.getAllDocuments);

// Download document
router.get('/:id/download', DocumentController.downloadDocument);

// Delete document
router.delete('/:id', DocumentController.deleteDocument);

module.exports = router;