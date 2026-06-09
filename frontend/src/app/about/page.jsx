'use client';

export default function AboutPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-green-600)'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          About KANAD
        </h1>
        <p className="page-subtitle">
          Smart Agriculture Intelligence Platform
        </p>
      </div>

      <div className="form-grid">
        <div className="card">
          <h2 className="section-title">The Project</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.7' }}>
            KANAD is an open-source, full-stack machine learning platform dedicated to advancing smart agriculture. 
            By integrating IoT sensors with predictive models, KANAD provides farmers with highly accurate, data-driven 
            insights for crop selection, fertilizer recommendations, disease detection, and automated irrigation planning.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.7' }}>
            Our irrigation system utilizes LSTM networks alongside real-time soil moisture and water flow sensors to intelligently forecast 
            water requirements, preserving resources while maximizing crop yield.
          </p>
        </div>

        <div className="card">
          <h2 className="section-title">The Team</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Built in collaboration by:
          </p>
          <ul className="result-list" style={{ marginTop: '1rem' }}>
            <li><strong>Aman Anubhav</strong></li>
            <li><strong>Ansh Tiwari</strong></li>
            <li><strong>Arshroop Saini</strong></li>
            <li><strong>Jiho Lee</strong></li>
            <li><strong>Riya Kathpalia</strong></li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Open Source</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          KANAD is completely open source. You can view the code, contribute to the project, or set it up for your own farm.
        </p>
        <a 
          href="https://github.com/amanaanubhav/KANAD-ML-OpenSource" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View GitHub Repository
        </a>
      </div>
    </div>
  );
}
