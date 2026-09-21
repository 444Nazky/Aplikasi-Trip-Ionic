import React, { useState } from 'react';
import './index.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sparkles' | 'chrome' | 'calendar' | 'terminal'>('sparkles');
  const [commandInput, setCommandInput] = useState('');

  return (
    <div className="opencode-console-root">
      {/* 1. Left Sidebar (50px) */}
      <aside className="activity-bar">
        <div className="activity-bar-nav">
          <button
            className={`activity-bar-btn ${activeTab === 'sparkles' ? 'active' : ''}`}
            onClick={() => setActiveTab('sparkles')}
            title="AI Agents"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
          </button>
          <button
            className={`activity-bar-btn ${activeTab === 'chrome' ? 'active' : ''}`}
            onClick={() => setActiveTab('chrome')}
            title="Browser & Preview"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" x2="12" y1="8" y2="8" />
              <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
              <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
            </svg>
          </button>
          <button
            className={`activity-bar-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
            title="Schedule & Logs"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </button>
          <button
            className={`activity-bar-btn ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
            title="Terminal Console"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" x2="20" y1="19" y2="19" />
            </svg>
          </button>
        </div>

        <div className="brand-vertical">OpenCode</div>
      </aside>

      {/* 2. Main Workspace (Flex Grow) */}
      <main className="main-workspace">
        {/* Top Header */}
        <header className="workspace-header">
          <div className="workspace-breadcrumbs">
            <span>workspace</span>
            <span>/</span>
            <span>session-1049</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>agent.log</span>
          </div>

          <div className="status-badge-model">Build · Claude Sonnet 4.5</div>
        </header>

        {/* Scrollable Console Workspace */}
        <div className="workspace-body">
          {/* User Prompt Card */}
          <div className="console-card">
            <div className="console-card-header">
              <span>PROMPT #1049</span>
              <span className="user-tag">@developer</span>
            </div>
            <div className="console-prompt-text">
              Run test suite on Trip Angkutan authentication module and check API sync queue.
            </div>
          </div>

          {/* Response Error Card with Red Left Indicator */}
          <div className="console-card error-card">
            <div className="console-card-header">
              <span className="error-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Runtime Error · NetworkException
              </span>
              <span>12:48:53 UTC</span>
            </div>

            <div className="code-block">
              TypeError: Cannot read properties of undefined (reading 'digest')<br />
              &nbsp;&nbsp;at hashPin (src/core/utils/hash.util.ts:4:38)<br />
              &nbsp;&nbsp;at AuthService.login (src/core/services/auth.service.ts:31:27)<br />
              &nbsp;&nbsp;at LoginPage.login (src/features/auth/login/login.page.ts:29:36)
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Resolved: Added fallback for non-secure WebView context & offline authentication demo session.
            </div>
          </div>
        </div>

        {/* Floating Command Input Bar */}
        <div className="command-input-container">
          <div className="command-input-bar">
            <input
              type="text"
              className="command-input-field"
              placeholder="Type command or prompt (e.g. /build, /debug, /sync)..."
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
            />
            <div className="command-input-footer">
              <div className="input-badges">
                <span className="provider-badge">Anthropic Claude</span>
                <span className="provider-badge">Temperature 0.2</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="shortcut-badge">
                  <span className="kbd">Tab</span> agents
                </span>
                <span className="shortcut-badge">
                  <span className="kbd">Ctrl</span> + <span className="kbd">P</span> commands
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Right Info Panel (280px) */}
      <aside className="info-panel">
        <div>
          {/* Session Info */}
          <div className="info-panel-section">
            <span className="section-label">Session</span>
            <div className="session-timestamp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Started Sep 21, 12:48:53</span>
            </div>
          </div>

          {/* Context Tokens */}
          <div className="info-panel-section">
            <span className="section-label">Context</span>
            <div className="stat-row">
              <span>Tokens Used</span>
              <span className="stat-value">42,850 / 200,000</span>
            </div>
            <div className="stat-row">
              <span>Capacity</span>
              <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>21.4%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '21.4%' }} />
            </div>
            <div className="stat-row" style={{ marginTop: '4px' }}>
              <span>Total Cost</span>
              <span className="stat-value" style={{ color: 'var(--accent-pink)' }}>$0.128</span>
            </div>
          </div>

          {/* LSP Status */}
          <div className="info-panel-section">
            <span className="section-label">Language Server (LSP)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="lsp-item">
                <span>TypeScript / Angular</span>
                <span className="status-dot green" title="Running" />
              </div>
              <div className="lsp-item">
                <span>Ionic / Capacitor</span>
                <span className="status-dot green" title="Running" />
              </div>
              <div className="lsp-item">
                <span>PostgreSQL DB</span>
                <span className="status-dot yellow" title="Sync Standby" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="info-panel-footer">
          <div className="online-indicator">
            <span className="status-dot green" />
            <span>OpenCode Connected</span>
          </div>
          <span>v1.0.4</span>
        </div>
      </aside>
    </div>
  );
};

export default App;
