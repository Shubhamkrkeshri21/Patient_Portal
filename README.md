# Patient Portal - Medical Document Management System

## Project Overview

A full-stack web application for managing medical documents (PDFs) in a patient portal. This application allows users to upload, view, download, and delete their medical documents through a clean web interface with a working backend API.

## Features

- **Document Upload**: Upload PDF medical documents with file type and size validation
- **Document Management**: View all uploaded documents in an organized list
- **File Operations**: Download documents with original filenames and delete unwanted documents
- **Real-time Feedback**: Display success and error messages for user actions
- **Responsive Design**: Mobile-friendly interface that works on all device sizes
- **File Validation**: Ensures only PDF files under 10MB are accepted

## Tech Stack

### Frontend
- **React 18** with Vite build tool
- **CSS3** with modern features (Flexbox, Grid, CSS Variables)
- **Axios** for HTTP requests
- **date-fns** for date formatting

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data persistence
- **Multer** middleware for file uploads
- **CORS** for cross-origin requests

## Project Structure

```
patient-portal/
├── design.md                   
├── README.md                   
├── backend/                     
│   ├── server.js               
│   ├── package.json            
│   ├── .env                   
│   ├── uploads/                
│   └── database/              
└── frontend/                  
    ├── package.json           
    ├── vite.config.js          
    ├── index.html              
    └── src/
        ├── main.jsx            
        ├── App.jsx             
        ├── components/        
        ├── services/           
        └── styles/             
```

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- Modern web browser (Chrome, Firefox, Edge)

## Installation

### 1. Clone and Setup

```bash
# Clone the repository (if applicable)
# git clone <repository-url>
# cd patient-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create necessary directories
mkdir uploads
mkdir database

# Start the backend server
npm start
```

The backend server will start on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Open a new terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on **http://localhost:5173**

## Access the Application

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload Document
- **URL**: `/documents/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (PDF file)

#### 2. List All Documents
- **URL**: `/documents`
- **Method**: `GET`
- **Response**: Array of document objects

#### 3. Download Document
- **URL**: `/documents/:id/download`
- **Method**: `GET`
- **Response**: PDF file download

#### 4. Delete Document
- **URL**: `/documents/:id`
- **Method**: `DELETE`
- **Response**: Success message

## API Examples

### Using cURL

#### Upload a PDF file:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@medical_report.pdf"
```

#### List all documents:
```bash
curl -X GET http://localhost:5000/api/documents
```

#### Download a document:
```bash
curl -X GET http://localhost:5000/api/documents/1/download \
  --output downloaded.pdf
```

#### Delete a document:
```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

### Using JavaScript (Axios)

```javascript
// Upload document
const formData = new FormData();
formData.append('file', pdfFile);

const response = await axios.post(
  'http://localhost:5000/api/documents/upload',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
```

## Application Usage

### Uploading Documents
1. Navigate to the application homepage
2. Click on the upload area or drag and drop a PDF file
3. Select a PDF file (maximum 10MB)
4. Click "Upload Document" button
5. Wait for the success confirmation

### Managing Documents
1. All uploaded documents appear in the "Your Documents" section
2. Each document card shows:
   - Original filename
   - File size
   - Upload date and time
   - Time since upload
3. Use the "Download" button to save a document to your device
4. Use the "Delete" button to remove a document (requires confirmation)

### Validation
- Only PDF files are accepted
- Maximum file size: 10MB
- File type validation occurs during upload

## Troubleshooting

### Common Issues

#### 1. Backend Server Won't Start
- Ensure you're in the `backend` directory
- Check if port 5000 is already in use
- Verify all dependencies are installed with `npm install`

#### 2. Frontend Server Won't Start
- Ensure you're in the `frontend` directory
- Check if port 5173 is already in use
- Verify all dependencies are installed with `npm install`

#### 3. File Upload Fails
- Check that the backend is running on http://localhost:5000
- Verify the file is a PDF and under 10MB
- Check browser console for CORS errors
- Ensure the `uploads` directory exists in the backend folder

#### 4. Database Issues
- Check that the `database` directory exists in the backend folder
- Verify the SQLite database file has proper permissions

#### 5. CORS Errors
- Ensure the frontend and backend are running on different ports
- Check the CORS configuration in `backend/server.js`
- Verify the frontend URL is included in CORS origin settings

### Port Configuration

By default:
- Backend runs on port 5000
- Frontend runs on port 5173

To change ports:

1. **Backend**: Modify the `PORT` variable in `backend/server.js`
2. **Frontend**: Modify the `port` in `frontend/vite.config.js`

### File Storage

- Uploaded files are stored in `backend/uploads/`
- File metadata is stored in SQLite database at `backend/database/database.db`
- Files are stored with unique names to prevent conflicts

## Development

### Running in Development Mode

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

#### Frontend:
```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

## Design Decisions

### 1. Technology Choices
- **React with Vite**: Chosen for fast development and excellent developer experience
- **Express.js**: Selected for its simplicity and strong middleware ecosystem
- **SQLite**: Used for its simplicity and zero-configuration requirements for local development
- **Pure CSS**: Implemented without CSS frameworks to demonstrate fundamental CSS skills

### 2. Architecture
- RESTful API design following standard conventions
- Separation of concerns between frontend and backend
- File storage separation from metadata storage
- Error handling at both API and UI levels

### 3. Security Considerations
- File type validation on both client and server
- File size limits to prevent abuse
- Unique filenames to prevent conflicts
- Input sanitization for database operations

## Limitations and Assumptions

### Current Limitations
- No user authentication (single-user system)
- Local file storage only
- No file encryption at rest
- No advanced search or filtering
- No pagination for document listing

### Assumptions Made
- Single user system for simplicity
- Maximum file size of 10MB per document
- PDF files only for medical documents
- Modern browser support required
- Local development environment

## Future Enhancements

Potential improvements for production deployment:

1. **User Authentication**: Implement login and user sessions
2. **Cloud Storage**: Integrate with cloud storage services (AWS S3, Google Cloud Storage)
3. **Database Migration**: Move from SQLite to PostgreSQL for production
4. **File Encryption**: Encrypt files at rest for added security
5. **Advanced Features**: Search, filtering, categorization, and tags
6. **PDF Processing**: Extract text, generate thumbnails, or add OCR
7. **Accessibility**: Improve accessibility compliance (WCAG)
8. **Testing**: Add unit and integration tests
9. **Deployment**: Containerization with Docker
10. **Monitoring**: Add logging and performance monitoring

## License

This project is for educational and demonstration purposes. No specific license is applied.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all prerequisites are met
3. Ensure all installation steps were followed correctly
4. Check browser console for specific error messages

## Acknowledgments

- Built as a demonstration project for full-stack development skills
- Focus on clean code, proper architecture, and user experience
- Emphasizes fundamental web development concepts without excessive dependencies
