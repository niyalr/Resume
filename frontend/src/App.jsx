import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, AlertCircle } from 'lucide-react';
import UploadResume from './components/upload_resume';
import JobDescription from './components/job_description';
import Scorecard from './components/scorecard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export default function App() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Auto-dismiss error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a resume file first.");
      return;
    }
    if (!jdText.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jdText);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze resume. Please try again.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={22} fill="white" />
          </div>
          <span className="brand-name">ResuMatch AI</span>
        </div>
        <div className="badge-tag">ATS Optimizer</div>
      </header>

      {/* Main Content Dashboard */}
      <main className="dashboard-grid">
        {/* Left Side: Inputs */}
        <div className="glass-card">
          <h2 className="card-title">
            <Cpu size={22} />
            Scanner Input
          </h2>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <UploadResume file={file} setFile={setFile} />
            <JobDescription text={jdText} setText={setJdText} />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={analyzing || !file || !jdText.trim()}
            >
              {analyzing ? (
                <>
                  <div className="loader" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Match
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Scorecard / Results */}
        <div>
          <Scorecard result={result} />
        </div>
      </main>

      {/* Toast Alert */}
      {error && (
        <div className="toast">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
