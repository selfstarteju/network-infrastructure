import { useState, useEffect } from 'react'

function App() {
  const [peerName, setPeerName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Real-time status state
  const [status, setStatus] = useState({
    vpn: { status: 'loading', state: '...' },
    storage: { status: 'loading', state: '...' },
    print: { status: 'loading', state: '...' }
  });

  // Logs state
  const [logs, setLogs] = useState({ visible: false, container: '', content: '' });

  // Fetch status on load and every 5 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/status');
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Backend unreachable", err);
        setStatus({
          vpn: { status: 'offline', state: 'unreachable' },
          storage: { status: 'offline', state: 'unreachable' },
          print: { status: 'offline', state: 'unreachable' }
        });
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateVPN = async (e) => {
    e.preventDefault();
    if(peerName) {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/vpn/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peerName })
        });
        if (res.ok) setShowQR(true);
      } catch (err) {
        console.error("Failed to generate VPN config", err);
      }
      setLoading(false);
    }
  };

  const handleViewLogs = async (containerName) => {
    setLogs({ visible: true, container: containerName, content: 'Loading logs...' });
    try {
      const res = await fetch(`http://localhost:3001/api/logs/${containerName}`);
      const data = await res.json();
      setLogs({ visible: true, container: containerName, content: data.logs || data.error });
    } catch (err) {
      setLogs({ visible: true, container: containerName, content: 'Failed to connect to backend.' });
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Network Command Center</h1>
        <p>Manage and monitor your decentralized infrastructure.</p>
      </header>

      <div className="dashboard-grid">
        {/* VPN Card */}
        <div className="glass-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              WireGuard VPN
            </h2>
            <div className={`status-badge ${status.vpn.status}`}>
              <span className={`status-dot ${status.vpn.status}`}></span>
              {status.vpn.status.toUpperCase()}
            </div>
          </div>
          <div className="card-content">
            Secure remote access node running on UDP 51820. 
            <br/><span style={{ fontSize: '0.85rem', color: '#64748b'}}>Docker State: {status.vpn.state}</span>
          </div>
          <form className="vpn-form" onSubmit={handleGenerateVPN}>
            <div className="input-group">
              <label>New Peer Name</label>
              <input 
                type="text" 
                placeholder="e.g. mobile-device" 
                value={peerName}
                onChange={(e) => setPeerName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Config'}
            </button>
          </form>
          
          <button className="btn btn-outline" style={{marginTop: '1rem'}} onClick={() => handleViewLogs('wireguard')}>View Logs</button>

          {showQR && (
            <div className="qr-placeholder">
              <svg className="icon qr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Config Generated</p>
            </div>
          )}
        </div>

        {/* Print Server Card */}
        <div className="glass-card flex-col">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              CUPS Print Server
            </h2>
            <div className={`status-badge ${status.print.status}`}>
              <span className={`status-dot ${status.print.status}`}></span>
              {status.print.status.toUpperCase()}
            </div>
          </div>
          <div className="card-content">
            Centralized network printing system on TCP/UDP 631. Manage printers and jobs via the admin interface.
            <br/><span style={{ fontSize: '0.85rem', color: '#64748b'}}>State: {status.print.state}</span>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="https://localhost:631" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Open Admin UI
            </a>
          </div>
        </div>

        {/* Storage Server Card */}
        <div className="glass-card flex-col">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              Nextcloud Storage
            </h2>
            <div className={`status-badge ${status.storage.status}`}>
              <span className={`status-dot ${status.storage.status}`}></span>
              {status.storage.status.toUpperCase()}
            </div>
          </div>
          <div className="card-content">
            Secure, self-hosted file synchronization and sharing platform with PostgreSQL backend.
            <br/><span style={{ fontSize: '0.85rem', color: '#64748b'}}>Docker State: {status.storage.state}</span>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: 'var(--accent-green)'}}>
              Access Files
            </a>
            <button className="btn btn-outline" onClick={() => handleViewLogs('nextcloud_app')}>View App Logs</button>
            <button className="btn btn-outline" onClick={() => handleViewLogs('nextcloud_db')}>View DB Logs</button>
          </div>
        </div>
      </div>

      {/* Logs Modal / Terminal View */}
      {logs.visible && (
        <div className="logs-modal-overlay" onClick={() => setLogs({ ...logs, visible: false })}>
          <div className="logs-modal" onClick={e => e.stopPropagation()}>
            <div className="logs-header">
              <h3>Terminal: {logs.container}</h3>
              <button onClick={() => setLogs({ ...logs, visible: false })}>Close</button>
            </div>
            <pre className="logs-content">{logs.content}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
