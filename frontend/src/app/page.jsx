import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero" style={{ marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          KANAD Intelligence
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>
          An integrated, data-driven agricultural platform designed to optimize crop yields, detect diseases early, and automate irrigation management through IoT sensors and predictive machine learning.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/crop-recommend" className="btn btn-primary btn-lg">Start Analysis</Link>
          <Link href="/irrigation" className="btn btn-secondary btn-lg">View Irrigation Dashboard</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
          </div>
          <div>
            <div className="stat-value">10.8K</div>
            <div className="stat-label">m³ water saved per acre/year</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 0 1 4 13V8h2a7 7 0 0 1 7 7v5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20a7 7 0 0 0 7-7v-5h-2a7 7 0 0 0-7 7v5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20v4"></path>
            </svg>
          </div>
          <div>
            <div className="stat-value">38</div>
            <div className="stat-label">Disease classes detected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div>
            <div className="stat-value">99.2%</div>
            <div className="stat-label">Model accuracy</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 17 4 4 4-4" />
            </svg>
          </div>
          <div>
            <div className="stat-value">24/7</div>
            <div className="stat-label">IoT monitoring</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <h2 className="section-title" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Core Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link href="/crop-recommend" className="card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon green" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 0 1 4 13V8h2a7 7 0 0 1 7 7v5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20a7 7 0 0 0 7-7v-5h-2a7 7 0 0 0-7 7v5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 20v4"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Crop Recommendation</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Input soil NPK levels, pH, rainfall and location to get AI-powered crop suggestions optimized for your specific environmental conditions.
          </p>
        </Link>

        <Link href="/fertilizer" className="card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon amber" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 2v7.31"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9.3V1.99"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 2h7"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.52 16h12.96"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Fertilizer Analysis</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Analyze soil nutrient deficiencies and receive precision fertilizer recommendations based on targeted crop requirements.
          </p>
        </Link>

        <Link href="/disease-detect" className="card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon blue" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Disease Detection</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Upload a leaf image for automated identification of 38 disease classes using our deep learning ResNet9 classification model.
          </p>
        </Link>

        <Link href="/irrigation" className="card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon red" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Smart Irrigation</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            LSTM-powered irrigation predictions integrated with live IoT sensor telemetry for automated scheduling and conservation.
          </p>
        </Link>
      </div>
    </div>
  );
}
