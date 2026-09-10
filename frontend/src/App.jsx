import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('access_token'))
  )

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setShowLogin(false)
  }

  /*
   * Logged-in users see the complete sports injury
   * analysis dashboard.
   */
  if (isLoggedIn) {
    return (
      <Dashboard onLogout={handleLogout} />
    )
  }

  /*
   * Login screen
   */
  if (showLogin) {
    return (
      <div className="app auth-app">
        <header className="navbar">

          <div className="brand">
            <div className="brand-icon">🏃</div>

            <div>
              <h2>Sports Injury</h2>
              <span>Risk Detection</span>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={() => setShowLogin(false)}
          >
            ← Back
          </button>

        </header>

        <Login
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  }

  /*
   * Public landing page
   */
  return (
    <div className="app landing-page">

      <header className="navbar">

        <div className="brand">
          <div className="brand-icon">🏃</div>

          <div>
            <h2>Sports Injury</h2>
            <span>Risk Detection</span>
          </div>
        </div>

        <nav>
          <a href="#home">Home</a>

          <a href="#about">
            How It Works
          </a>

          <button
            className="nav-login-button"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        </nav>

      </header>

      <main>

        {/* HERO */}

        <section
          id="home"
          className="hero-section"
        >
          <div className="hero-content">

            <div className="hero-badge">
              ✦ AI-POWERED SPORTS SAFETY
            </div>

            <h1>
              Analyze Your Movement.
              <br />

              <span>
                Detect Risk Before Injury.
              </span>
            </h1>

            <p className="description">
              Upload your athlete training video and get
              AI-powered movement analysis, pose estimation,
              biomechanical features and injury risk assessment.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() => setShowLogin(true)}
              >
                ☁ Upload New Video
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  document
                    .getElementById('about')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    })
                }
              >
                Learn More →
              </button>

            </div>

            <div className="hero-stats">

              <div>
                <strong>AI</strong>
                <span>Powered Analysis</span>
              </div>

              <div>
                <strong>Pose</strong>
                <span>Estimation</span>
              </div>

              <div>
                <strong>ML</strong>
                <span>Risk Prediction</span>
              </div>

            </div>

          </div>
        </section>


        {/* HOW IT WORKS */}

        <section
          id="about"
          className="about-section"
        >

          <div className="section-heading">

            <span>
              ✦ SYSTEM WORKFLOW
            </span>

            <h2>
              From Video to Risk Assessment
            </h2>

            <p>
              Our system combines computer vision,
              biomechanical feature extraction and
              machine learning.
            </p>

          </div>


          <div className="features">

            <div className="feature-card">

              <div className="feature-number">
                01
              </div>

              <div className="feature-icon">
                ☁
              </div>

              <h3>
                Upload Video
              </h3>

              <p>
                Upload an athlete training or movement
                video for analysis.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                02
              </div>

              <div className="feature-icon">
                ◉
              </div>

              <h3>
                Pose Detection
              </h3>

              <p>
                MediaPipe detects body landmarks from
                the athlete's movement.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                03
              </div>

              <div className="feature-icon">
                ◈
              </div>

              <h3>
                Feature Extraction
              </h3>

              <p>
                Biomechanical and movement features are
                extracted from the detected landmarks.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                04
              </div>

              <div className="feature-icon">
                ◇
              </div>

              <h3>
                Risk Prediction
              </h3>

              <p>
                The machine learning model estimates
                the athlete's injury risk probability.
              </p>

            </div>

          </div>

        </section>


        {/* SYSTEM CAPABILITIES */}

        <section className="capabilities-section">

          <div className="capability-content">

            <span className="section-label">
              ✦ AI POWERED
            </span>

            <h2>
              Advanced Athlete
              <br />
              Movement Analysis
            </h2>

            <p>
              The platform combines video processing,
              pose estimation, biomechanical analysis
              and machine learning to identify potential
              movement-related injury risks.
            </p>

            <div className="capability-list">

              <div>
                <span>✓</span>
                Video-based movement analysis
              </div>

              <div>
                <span>✓</span>
                MediaPipe pose estimation
              </div>

              <div>
                <span>✓</span>
                Biomechanical feature extraction
              </div>

              <div>
                <span>✓</span>
                Machine learning risk prediction
              </div>

            </div>

            <button
              className="primary-button"
              onClick={() => setShowLogin(true)}
            >
              Start Analysis →
            </button>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="landing-footer">

        <div>
          🛡 Sports Injury Risk Detection System
        </div>

        <div>
          AI-Powered&nbsp; • &nbsp;Accurate&nbsp; • &nbsp;Reliable
        </div>

        <div>
          © 2026 All rights reserved.
        </div>

      </footer>

    </div>
  )
}

export default App