import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setShowLogin(false)
  }

if (isLoggedIn) {
  return (
    <Dashboard
      onLogout={handleLogout}
    />
  )
}

  if (showLogin && !isLoggedIn) {
    return (
      <div className="app">
        <header className="navbar">
          <h2>Sports Injury Risk Detection</h2>

          <button
            className="secondary-button"
            onClick={() => setShowLogin(false)}
          >
            Back
          </button>
        </header>

        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <h2>Sports Injury Risk Detection</h2>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>

          {isLoggedIn ? (
            <button
              className="nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="nav-button"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-content">
            <p className="tagline">AI-Powered Sports Safety</p>

            <h1>
              Detect Movement Risks
              <br />
              Before Injury Happens
            </h1>

            <p className="description">
              Analyze athlete movement videos using AI and biomechanical
              analysis to identify abnormal movement patterns and potential
              injury risks.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => setShowLogin(true)}
              >
                Get Started
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  document
                    .getElementById('about')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <h2>How It Works</h2>

          <div className="features">
            <div className="feature-card">
              <h3>1. Upload Video</h3>
              <p>
                Upload an athlete movement video for analysis.
              </p>
            </div>

            <div className="feature-card">
              <h3>2. AI Analysis</h3>
              <p>
                Analyze body movement and biomechanical patterns.
              </p>
            </div>

            <div className="feature-card">
              <h3>3. Risk Assessment</h3>
              <p>
                Identify potential injury risk factors and abnormal
                movement patterns.
              </p>
            </div>
          </div>
        </section>

        {!isLoggedIn && (
          <section id="login" className="login-section">
            <h2>Get Started</h2>

            <p>
              Login to upload and analyze your athlete videos.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          </section>
        )}

        {isLoggedIn && (
          <section className="login-section">
            <h2>Welcome!</h2>

            <p>
              You are successfully logged in.
            </p>

            <button
              className="primary-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>
        )}
      </main>

      <footer>
        <p>Sports Injury Risk Detection Platform</p>
      </footer>
    </div>
  )
}

export default App