import React from 'react'
import './DocumentList.css'
import DocumentCard from './DocumentCard'

const DocumentList = ({ documents, onDelete, onError }) => {
  return (
    <div className="document-list">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDelete}
          onError={onError}
        />
      ))}
    </div>
  )
}

export default DocumentList