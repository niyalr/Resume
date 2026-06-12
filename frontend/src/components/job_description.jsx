import React from 'react';

export default function JobDescription({ text, setText }) {
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="form-group">
      <div className="form-label">
        <span>Job Description</span>
        <span className="form-label-counter">
          {wordCount} {wordCount === 1 ? 'word' : 'words'} ({text.length} chars)
        </span>
      </div>
      <textarea
        className="textarea-custom"
        value={text}
        onChange={handleChange}
        placeholder="Paste the target job description here (responsibilities, requirements, skills)..."
        maxLength={8000}
      />
    </div>
  );
}
