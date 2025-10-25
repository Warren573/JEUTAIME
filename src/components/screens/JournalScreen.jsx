import React from 'react';
import { journalNews } from '../../data/appData';

export default function JournalScreen() {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '600' }}>📰 Journal</h1>
      {journalNews.map((news) => (
        <div key={news.id} style={{ background: '#1a1a1a', borderRadius: '15px', padding: '15px', marginBottom: '12px', borderLeft: '4px solid #E91E63' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '24px' }}>{news.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 4px 0', fontWeight: '700' }}>{news.title}</h3>
              <p style={{ fontSize: '12px', color: '#ccc', margin: '0 0 6px 0' }}>{news.desc}</p>
              <div style={{ fontSize: '11px', color: '#888' }}>{news.time} • ❤️ {news.reactions}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
