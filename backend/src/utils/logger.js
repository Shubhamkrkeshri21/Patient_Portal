const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    
    console.log(logMessage);
    
    if (data) {
      console.log('Data:', data);
    }

    // Write to file
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    const fileMessage = data ? `${logMessage}\nData: ${JSON.stringify(data, null, 2)}\n` : `${logMessage}\n`;
    
    fs.appendFile(logFile, fileMessage, (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }
}

module.exports = new Logger();