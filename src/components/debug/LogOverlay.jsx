/**
 * LOG OVERLAY - Affiche les logs console à l'écran
 */
import React, { useState, useEffect } from 'react';

export default function LogOverlay() {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intercepter console.log, console.warn, console.error
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-50), { type: 'log', message, time: Date.now() }]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-50), { type: 'warn', message, time: Date.now() }]);
    };

    console.error = (...args) => {
      originalError(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev.slice(-50), { type: 'error', message, time: Date.now() }]);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#000',
          color: '#0f0',
          border: '2px solid #0f0',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 99999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        📋
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40vh',
      background: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '9px',
      overflowY: 'auto',
      zIndex: 99999,
      border: '2px solid #0f0',
      padding: '10px'
    }}>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'sticky',
          top: 0,
          right: 0,
          float: 'right',
          background: '#f00',
          color: '#fff',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        ❌ Fermer
      </button>
      <button
        onClick={() => setLogs([])}
        style={{
          position: 'sticky',
          top: 0,
          right: '70px',
          float: 'right',
          background: '#ff0',
          color: '#000',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
          marginBottom: '10px',
          marginRight: '5px'
        }}
      >
        🗑️ Vider
      </button>
      <div style={{ clear: 'both' }}></div>
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            marginBottom: '5px',
            padding: '5px',
            background: log.type === 'error' ? '#3a0000' : log.type === 'warn' ? '#3a3a00' : 'transparent',
            borderLeft: `3px solid ${log.type === 'error' ? '#f00' : log.type === 'warn' ? '#ff0' : '#0f0'}`,
            wordBreak: 'break-word'
          }}
        >
          <span style={{ color: '#888' }}>[{new Date(log.time).toLocaleTimeString()}]</span>{' '}
          {log.message}
        </div>
      ))}
    </div>
  );
}
