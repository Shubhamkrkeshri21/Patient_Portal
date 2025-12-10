const Document = require('../models/Document');
const fs = require('fs').promises;
const path = require('path');

class DocumentController {
  // Upload a document
  static async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { originalname, filename, size, path: filepath } = req.file;

      // Create document record
      Document.create(
        {
          filename,
          originalName: originalname,
          filepath: filename,
          filesize: size
        },
        (err, document) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to save document metadata'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: {
              id: document.id,
              filename: document.filename,
              originalName: document.originalName,
              filesize: document.filesize,
              createdAt: document.createdAt
            }
          });
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }

  // Get all documents
  static async getAllDocuments(req, res) {
    try {
      Document.findAll((err, documents) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch documents'
          });
        }

        res.json({
          success: true,
          documents: documents || []
        });
      });
    } catch (error) {
      console.error('List documents error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch documents'
      });
    }
  }

  // Download a document
  static async downloadDocument(req, res) {
    try {
      const { id } = req.params;

      Document.findById(id, async (err, document) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            error: 'Database error'
          });
        }

        if (!document) {
          return res.status(404).json({
            success: false,
            error: 'Document not found'
          });
        }

        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const filePath = path.join(uploadDir, document.filepath);

        try {
          // Check if file exists
          await fs.access(filePath);

          // Set headers for file download
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

          // Stream the file
          const fileStream = require('fs').createReadStream(filePath);
          fileStream.pipe(res);
        } catch (fileError) {
          console.error('File error:', fileError);
          res.status(404).json({
            success: false,
            error: 'File not found on server'
          });
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download document'
      });
    }
  }

  // Delete a document
  static async deleteDocument(req, res) {
    try {
      const { id } = req.params;

      Document.findById(id, async (err, document) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            error: 'Database error'
          });
        }

        if (!document) {
          return res.status(404).json({
            success: false,
            error: 'Document not found'
          });
        }

        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const filePath = path.join(uploadDir, document.filepath);

        try {
          // Delete file from filesystem
          await fs.unlink(filePath);
        } catch (fileError) {
          console.warn('File not found during deletion:', fileError);
        }

        // Delete record from database
        Document.delete(id, (deleteErr) => {
          if (deleteErr) {
            console.error('Delete error:', deleteErr);
            return res.status(500).json({
              success: false,
              error: 'Failed to delete document record'
            });
          }

          res.json({
            success: true,
            message: 'Document deleted successfully'
          });
        });
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document'
      });
    }
  }
}

module.exports = DocumentController;