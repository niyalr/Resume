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

  // New States for Sandbox & Live Editor
  const [activeTab, setActiveTab] = useState('scanner');
  const [rawText, setRawText] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');

  // Auto-dismiss error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Debounced auto-sync effect for real-time sandbox edits
  useEffect(() => {
    if (activeTab !== 'sandbox' || !result) return;

    // If the text matches the currently stored result raw_text, it is already synced
    if (rawText === result.raw_text) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('syncing');

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/analyze-text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume_text: rawText,
            job_description: jdText,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to update match score. Please try again.');
        }

        setResult(data);
        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('error');
        setError(err.message);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [rawText, activeTab, jdText]);

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
      if (data.raw_text) {
        setRawText(data.raw_text);
        setSyncStatus('synced');
      }
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

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <Sparkles size={15} />
          Scanner Dashboard
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
          disabled={!result}
          title={!result ? 'Scan your resume first to unlock the sandbox' : ''}
        >
          <Cpu size={15} />
          ATS Sandbox & Editor {!result && '🔒'}
        </button>
      </div>

      {/* Main Content Dashboard */}
      {activeTab === 'scanner' ? (
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
      ) : (
        <main className="sandbox-grid">
          {/* Left Side: Raw Text Editor */}
          <div className="glass-card editor-card">
            <div className="editor-header">
              <div className="editor-title">
                <Cpu size={20} />
                <span>ATS Machine Vision Editor</span>
              </div>
              <div className={`sync-indicator ${syncStatus}`}>
                {syncStatus === 'syncing' && <span className="pulse-dot"></span>}
                <span>
                  {syncStatus === 'syncing' && 'Syncing changes...'}
                  {syncStatus === 'synced' && '✓ Score up to date'}
                  {syncStatus === 'error' && '⚠ Update failed'}
                  {syncStatus === 'idle' && ''}
                </span>
              </div>
            </div>
            <p className="editor-subtitle">
              This is the raw, unformatted text that ATS scanners parse from your document. Add missing keywords, adjust phrasing, or fix layout issues directly in this window, and watch your score adjust in real-time.
            </p>
            <textarea
              className="sandbox-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Resume raw text will load here..."
            />
          </div>

          {/* Right Side: Live Scorecard */}
          <div>
            <Scorecard result={result} />
          </div>
        </main>
      )}

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

