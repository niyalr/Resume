import React, { useState } from 'react';
import { 
  Award, CheckCircle, AlertTriangle, Info,
  Mail, Phone, Linkedin, Github, FileText, Check, AlertOctagon, X
} from 'lucide-react';

export default function Scorecard({ result }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) {
    return (
      <div className="scorecard-empty">
        <div className="scorecard-empty-icon">
          <Award size={36} />
        </div>
        <h3>Analysis Results</h3>
        <p>Upload your resume and paste the job description, then click "Analyze" to see your score and recommendations.</p>
      </div>
    );
  }

  const { scores, skills_analysis, ats_check, keyword_match, suggestions } = result;
  const finalScore = scores.final_score;
  const skillScore = scores.skill_score;
  const semanticScore = scores.semantic_score;
  
  // Calculate SVG stroke attributes
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalScore / 100) * circumference;

  // Determine score color class
  let scoreColor = 'var(--error)';
  if (finalScore >= 75) scoreColor = 'var(--success)';
  else if (finalScore >= 50) scoreColor = 'var(--warning)';

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 className="card-title">
        <Award size={22} />
        Analysis Results
      </h2>

      {/* Overall Score Circle & Bar Metrics */}
      <div className="score-summary">
        <div className="radial-score-container">
          <svg className="radial-score-svg">
            <circle className="radial-score-bg" cx="65" cy="65" r={radius} />
            <circle 
              className="radial-score-fill" 
              cx="65" 
              cy="65" 
              r={radius} 
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="radial-score-text">
            <span className="score-num">{finalScore}%</span>
            <span className="score-lbl">Match</span>
          </div>
        </div>

        <div className="score-metrics">
          <div className="metric-bar-group">
            <div className="metric-label">
              <span>Skills Alignment</span>
              <span>{skillScore}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${skillScore}%`, backgroundColor: 'var(--primary)' }} />
            </div>
          </div>
          <div className="metric-bar-group">
            <div className="metric-label">
              <span>Semantic Similarity</span>
              <span>{semanticScore}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${semanticScore}%`, backgroundColor: 'var(--secondary)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1rem' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'var(--transition-smooth)'
          }}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'skills' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'skills' ? 'white' : 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'var(--transition-smooth)'
          }}
        >
          Skills Gap ({skills_analysis.missing_skills.length})
        </button>
        <button 
          onClick={() => setActiveTab('ats')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'ats' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'ats' ? 'white' : 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'var(--transition-smooth)'
          }}
        >
          ATS Checklist
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '380px', paddingRight: '0.25rem' }}>
        {activeTab === 'overview' && (
          <div className="suggestions-layout">
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommendations</h3>
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const isHigh = item.severity === 'high';
                const isMed = item.severity === 'medium';
                return (
                  <div className="suggestion-item" key={idx}>
                    <div className={`suggestion-icon ${item.severity}`}>
                      {isHigh ? <AlertOctagon size={18} /> : isMed ? <AlertTriangle size={18} /> : <Info size={18} />}
                    </div>
                    <div className="suggestion-details">
                      <div>
                        <span className={`suggestion-badge ${item.severity}`}>
                          {item.severity}
                        </span>
                        <span className="suggestion-category" style={{ marginLeft: '0.5rem' }}>
                          {item.category}
                        </span>
                      </div>
                      <p className="suggestion-msg">{item.message}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-suggestions">
                <CheckCircle size={36} />
                <p>Outstanding! No critical improvements recommended.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <div className="skills-container">
              <h4 className="skills-heading">Matched Core Skills ({skills_analysis.matched_skills.length})</h4>
              {skills_analysis.matched_skills.length > 0 ? (
                <div className="skills-list">
                  {skills_analysis.matched_skills.map((skill, idx) => (
                    <span className="skill-pill matched" key={idx}>
                      <Check size={12} /> {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="skills-empty-state">No matching core skills identified.</p>
              )}
            </div>

            <div className="skills-container" style={{ marginTop: '1.5rem' }}>
              <h4 className="skills-heading">Missing Core Skills ({skills_analysis.missing_skills.length})</h4>
              {skills_analysis.missing_skills.length > 0 ? (
                <div className="skills-list">
                  {skills_analysis.missing_skills.map((skill, idx) => (
                    <span className="skill-pill missing" key={idx}>
                      <X size={12} /> {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="skills-empty-state" style={{ color: 'var(--success)', fontStyle: 'normal' }}>
                  Amazing! You possess all the core skills identified in the job description.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="ats-grid">
            <div className="ats-card">
              <div className={`ats-card-icon ${ats_check.has_email ? 'pass' : 'fail'}`}>
                <Mail size={18} />
              </div>
              <span className="ats-card-label">Email Address</span>
              <span className={`ats-card-value ${ats_check.has_email ? 'pass' : 'fail'}`}>
                {ats_check.has_email ? 'Found' : 'Missing'}
              </span>
            </div>

            <div className="ats-card">
              <div className={`ats-card-icon ${ats_check.has_phone ? 'pass' : 'fail'}`}>
                <Phone size={18} />
              </div>
              <span className="ats-card-label">Phone Number</span>
              <span className={`ats-card-value ${ats_check.has_phone ? 'pass' : 'fail'}`}>
                {ats_check.has_phone ? 'Found' : 'Missing'}
              </span>
            </div>

            <div className="ats-card">
              <div className={`ats-card-icon ${ats_check.has_linkedin ? 'pass' : 'fail'}`}>
                <Linkedin size={18} />
              </div>
              <span className="ats-card-label">LinkedIn Link</span>
              <span className={`ats-card-value ${ats_check.has_linkedin ? 'pass' : 'fail'}`}>
                {ats_check.has_linkedin ? 'Found' : 'Missing'}
              </span>
            </div>

            <div className="ats-card">
              <div className={`ats-card-icon ${ats_check.has_github ? 'pass' : 'fail'}`}>
                <Github size={18} />
              </div>
              <span className="ats-card-label">GitHub Link</span>
              <span className={`ats-card-value ${ats_check.has_github ? 'pass' : 'fail'}`}>
                {ats_check.has_github ? 'Found' : 'Missing'}
              </span>
            </div>

            <div className="ats-card">
              <div className="ats-card-icon pass" style={{ color: 'var(--primary)', background: 'rgba(139, 92, 246, 0.1)' }}>
                <FileText size={18} />
              </div>
              <span className="ats-card-label">Word Count</span>
              <span className="ats-card-value pass" style={{ color: 'white' }}>
                {ats_check.word_count} words
              </span>
            </div>
            
            <div className="ats-card">
              <div className={`ats-card-icon ${ats_check.missing_sections.length === 0 ? 'pass' : 'fail'}`}>
                <CheckCircle size={18} />
              </div>
              <span className="ats-card-label">Core Layout</span>
              <span className={`ats-card-value ${ats_check.missing_sections.length === 0 ? 'pass' : 'fail'}`}>
                {ats_check.missing_sections.length === 0 ? 'Complete' : `${4 - ats_check.missing_sections.length}/4 Sections`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
