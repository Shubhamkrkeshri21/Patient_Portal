const fs = require('fs').promises;
const path = require('path');

class FileHelper {
  // Format file size to human readable format
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file exists
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Get file extension
  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  // Validate PDF file
  static isValidPDF(file) {
    const allowedExtensions = ['.pdf'];
    const allowedMimeTypes = ['application/pdf'];
    
    const extension = this.getFileExtension(file.originalname);
    const isValidExtension = allowedExtensions.includes(extension);
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    
    return isValidExtension && isValidMimeType;
  }
}

module.exports = FileHelper;