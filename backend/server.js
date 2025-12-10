const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Create uploads directory
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create database directory
const dbDir = './database';
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Simple SQLite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload endpoint
app.post('/api/documents/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { originalname, filename, size } = req.file;
    
    // Save to database
    const sql = `INSERT INTO documents (filename, originalName, filepath, filesize) VALUES (?, ?, ?, ?)`;
    db.run(sql, [filename, originalname, filename, size], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to save document'
        });
      }

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        document: {
          id: this.lastID,
          filename: filename,
          originalName: originalname,
          filesize: size,
          createdAt: new Date().toISOString()
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload document'
    });
  }
});

// Get all documents
app.get('/api/documents', (req, res) => {
  const sql = 'SELECT * FROM documents ORDER BY createdAt DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch documents'
      });
    }
    
    res.json({
      success: true,
      documents: rows || []
    });
  });
});

// Download document
app.get('/api/documents/:id/download', (req, res) => {
  const { id } = req.params;
  
  const sql = 'SELECT * FROM documents WHERE id = ?';
  db.get(sql, [id], (err, document) => {
    if (err || !document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const filePath = path.join(uploadDir, document.filepath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.download(filePath, document.originalName);
  });
});

// Delete document
app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  
  // Get document first
  const getSql = 'SELECT * FROM documents WHERE id = ?';
  db.get(getSql, [id], (err, document) => {
    if (err || !document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const filePath = path.join(uploadDir, document.filepath);
    
    // Delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    const deleteSql = 'DELETE FROM documents WHERE id = ?';
    db.run(deleteSql, [id], (err) => {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete document'
        });
      }

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uploadsDir: fs.existsSync(uploadDir),
    databaseDir: fs.existsSync(dbDir)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.resolve(uploadDir)}`);
  console.log(`🗃️ Database: ${path.resolve('./database/database.db')}`);
});