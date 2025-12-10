const db = require('../config/database');

class Document {
  // Create a new document record
  static create(documentData, callback) {
    const { filename, originalName, filepath, filesize } = documentData;
    const sql = `INSERT INTO documents (filename, originalName, filepath, filesize) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [filename, originalName, filepath, filesize], function(err) {
      if (err) {
        callback(err, null);
      } else {
        // Get the inserted document
        db.get('SELECT * FROM documents WHERE id = ?', [this.lastID], callback);
      }
    });
  }

  // Get all documents
  static findAll(callback) {
    const sql = 'SELECT * FROM documents ORDER BY createdAt DESC';
    db.all(sql, callback);
  }

  // Find document by ID
  static findById(id, callback) {
    const sql = 'SELECT * FROM documents WHERE id = ?';
    db.get(sql, [id], callback);
  }

  // Delete document by ID
  static delete(id, callback) {
    const sql = 'DELETE FROM documents WHERE id = ?';
    db.run(sql, [id], callback);
  }
}

module.exports = Document;