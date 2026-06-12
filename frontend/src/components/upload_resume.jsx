import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function UploadResume({ file, setFile }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const parts = selectedFile.name.split('.');
    const extension = parts.length > 1 ? parts.pop().toLowerCase() : '';
    
    if (allowedExtensions.includes(extension)) {
      setFile(selectedFile);
    } else {
      alert("Unsupported file type. Please upload a PDF, Word document (.docx/.doc), or text file (.txt).");
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="form-group">
      <label className="form-label">Upload Resume</label>
      
      {!file ? (
        <div 
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input 
            ref={inputRef}
            type="file" 
            style={{ display: 'none' }}
            onChange={handleChange}
            accept=".pdf,.docx,.doc,.txt"
          />
          <div className="dropzone-icon">
            <UploadCloud size={28} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
              Drag & drop your resume here
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Supports PDF, DOCX, DOC, or TXT
            </p>
          </div>
        </div>
      ) : (
        <div className="file-info">
          <div className="file-info-main">
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            <span className="file-info-name" title={file.name}>{file.name}</span>
          </div>
          <button 
            type="button" 
            className="btn-remove-file"
            onClick={() => setFile(null)}
            aria-label="Remove file"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
