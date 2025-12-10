import React, { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import Alert from "./components/Alert";
import { apiService as api } from "./services/api.jsx";

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.getDocuments();
      if (response.success) {
        setDocuments(response.documents || []);
      }
    } catch (error) {
      showAlert("Failed to fetch documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newDocument) => {
    setDocuments([newDocument, ...documents]);
    showAlert("Document uploaded successfully!", "success");
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="app">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <center>Patient Portal</center>
          </h1>
          <p className="header-subtitle">
            <center>Manage your medical documents securely</center>
          </p>
        </div>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <div className="container">
            <h2 className="section-title">
              <center>Upload Medical Document</center>
            </h2>
            <p className="section-description">
              <center>
                Upload your prescriptions, test results, or referral notes (PDF
                only, max 10MB)
              </center>
            </p>
            <UploadForm
              onUploadSuccess={handleUploadSuccess}
              onError={(message) => showAlert(message, "error")}
            />
          </div>
        </section>

        <section className="documents-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Your Documents</h2>
              <span className="document-count">
                {documents.length} documents
              </span>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3>No documents yet</h3>
                <p>Upload your first medical document to get started</p>
              </div>
            ) : (
              <DocumentList
                documents={documents}
                onDelete={handleDeleteDocument}
                onError={(message) => showAlert(message, "error")}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Patient Portal
            <br />
            Your medical documents are stored locally
          </p>
          <p className="footer-note">
            © 2025 Medical App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
