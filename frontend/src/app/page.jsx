import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span>KANAD</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered agricultural intelligence platform. Optimize your crops, detect diseases early, and automate irrigation with smart IoT integration.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
          <Link href="/crop-recommend" className="btn btn-primary btn-lg">Get Started →</Link>
          <Link href="/irrigation" className="btn btn-secondary btn-lg">Irrigation Dashboard</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon green">💧</div>
          <div>
            <div className="stat-value">10.8K</div>
            <div className="stat-label">m³ water saved per acre/year</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🌾</div>
          <div>
            <div className="stat-value">38</div>
            <div className="stat-label">Disease classes detected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🤖</div>
          <div>
            <div className="stat-value">99.2%</div>
            <div className="stat-label">Model accuracy</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">📡</div>
          <div>
            <div className="stat-value">24/7</div>
            <div className="stat-label">IoT monitoring</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <h2 className="section-title">Core Services</h2>
      <div className="feature-grid">
        <Link href="/crop-recommend" className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(34,232,122,0.12)' }}>🌾</div>
          <h3 className="feature-card-title">Crop Recommendation</h3>
          <p className="feature-card-desc">
            Input soil NPK levels, pH, rainfall and location to get AI-powered crop suggestions optimized for your conditions.
          </p>
        </Link>

        <Link href="/fertilizer" className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>🧪</div>
          <h3 className="feature-card-title">Fertilizer Recommendation</h3>
          <p className="feature-card-desc">
            Analyze soil nutrient deficiencies and get personalized fertilizer recommendations with NPK ratio analysis.
          </p>
        </Link>

        <Link href="/disease-detect" className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(96,165,250,0.12)' }}>🔬</div>
          <h3 className="feature-card-title">Disease Detection</h3>
          <p className="feature-card-desc">
            Upload a leaf image and our ResNet9 CNN identifies diseases across 14 crop varieties with treatment guidance.
          </p>
        </Link>

        <Link href="/irrigation" className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(248,113,113,0.12)' }}>💧</div>
          <h3 className="feature-card-title">Smart Irrigation</h3>
          <p className="feature-card-desc">
            LSTM-powered irrigation predictions with IoT sensor monitoring, automated scheduling, and water usage tracking.
          </p>
        </Link>
      </div>

      {/* Team */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { name: 'Aman Anubhav', role: 'AI/ML Lead', icon: '🧠' },
          { name: 'Arshroop Saini', role: 'AI/ML & IoT', icon: '🤖' },
          { name: 'Ansh Tiwari', role: 'AI/ML', icon: '🧪' },
          { name: 'Jiho Lee', role: 'Backend/API', icon: '⚙️' },
          { name: 'Riya Kathpalia', role: 'Frontend/UI', icon: '🎨' },
        ].map((member) => (
          <div key={member.name} className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{member.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{member.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
