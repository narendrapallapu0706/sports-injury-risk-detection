import { useEffect, useState } from 'react'
import RiskAssessment from './RiskAssessment'

const API_URL = 'http://localhost:8000'

function Dashboard({ onLogout }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)

  const [analyzingId, setAnalyzingId] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  const fetchVideos = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('You are not authenticated. Please login again.')
      setLoadingVideos(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/videos/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load videos')
      }

      setVideos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingVideos(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(file)
    setMessage('')
    setError('')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video first.')
      return
    }

    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('You are not authenticated. Please login again.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_URL}/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Video upload failed')
      }

      setMessage(
        `Video uploaded successfully. Video ID: ${data.video_id}`,
      )

      setSelectedFile(null)

      const input = document.getElementById('video-upload')

      if (input) {
        input.value = ''
      }

      await fetchVideos()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async (videoId) => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('You are not authenticated. Please login again.')
      return
    }

    setAnalyzingId(videoId)
    setMessage('')
    setError('')
    setAnalysisResult(null)

    try {
      const response = await fetch(
        `${API_URL}/videos/${videoId}/analyze`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Video analysis failed',
        )
      }

      setMessage(
        `Analysis completed successfully for Video ID: ${videoId}`,
      )

      setAnalysisResult(data)

      await fetchVideos()
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzingId(null)
    }
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A'
    }

    const number = Number(value)

    if (Number.isNaN(number)) {
      return String(value)
    }

    return number.toFixed(2)
  }

  const totalVideos = videos.length

  const completedVideos = videos.filter(
    (video) => video.status === 'completed',
  ).length

  const processingVideos = videos.filter(
    (video) => video.status === 'processing',
  ).length

  const uploadedVideos = videos.filter(
    (video) => video.status === 'uploaded',
  ).length

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  return (
    <div className="dashboard">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-brand-icon">
            🏃
          </div>

          <div>
            <strong>Sports Injury</strong>
            <span>RISK DETECTION</span>
          </div>

        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          <button
            className="sidebar-link active"
            onClick={() => scrollTo('dashboard-home')}
          >
            <span className="sidebar-icon">▣</span>
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollTo('upload')}
          >
            <span className="sidebar-icon">↥</span>
            <span>Upload Video</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollTo('history')}
          >
            <span className="sidebar-icon">▤</span>
            <span>Video History</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollTo('assessment')}
          >
            <span className="sidebar-icon">◈</span>
            <span>Risk Assessment</span>
          </button>

        </nav>

        <div className="sidebar-section-title">
          ANALYSIS
        </div>

        <nav className="sidebar-nav">

          <button
            className="sidebar-link"
            onClick={() => scrollTo('risk-overview')}
          >
            <span className="sidebar-icon">◉</span>
            <span>Risk Overview</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollTo('analysis-results')}
          >
            <span className="sidebar-icon">▥</span>
            <span>Analysis Results</span>
          </button>

        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-section-title">
          ACCOUNT
        </div>

        <button
          className="sidebar-link logout-link"
          onClick={onLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="dashboard-main">

        {/* TOP HEADER */}

        <header className="dashboard-topbar">

          <div className="dashboard-heading">

            <span className="dashboard-kicker">
              ATHLETE ANALYTICS
            </span>

            <h1>
              Sports Injury Dashboard
            </h1>

          </div>

          <div className="dashboard-user">

            <div className="system-status">
              <span className="status-dot" />
              AI System Online
            </div>

            <div className="user-profile">

              <div className="user-avatar">
                A
              </div>

              <div className="user-info">
                <strong>Athlete</strong>
                <span>Dashboard</span>
              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <main className="dashboard-content">

          {/* =================================================
              WELCOME BANNER
          ================================================== */}

          <section
            id="dashboard-home"
            className="welcome-banner"
          >

            <div>

              <span className="section-label">
                ✦ AI-POWERED ANALYSIS
              </span>

              <h2>
                Welcome back!
              </h2>

              <p>
                Analyze athlete movement and identify
                potential injury risks using AI-powered
                computer vision.
              </p>

            </div>

            <button
              className="welcome-upload-button"
              onClick={() => scrollTo('upload')}
            >
              + Upload New Video
            </button>

          </section>


          {/* =================================================
              STATISTICS
          ================================================== */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-card-icon">
                ▣
              </div>

              <div className="stat-card-content">
                <span>Total Videos</span>
                <strong>{totalVideos}</strong>
              </div>

              <small>
                All uploaded videos
              </small>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-card-icon">
                ✓
              </div>

              <div className="stat-card-content">
                <span>Completed</span>
                <strong>{completedVideos}</strong>
              </div>

              <small>
                Successfully analyzed
              </small>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-card-icon">
                ◷
              </div>

              <div className="stat-card-content">
                <span>Processing</span>
                <strong>{processingVideos}</strong>
              </div>

              <small>
                Currently analyzing
              </small>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-card-icon">
                ↑
              </div>

              <div className="stat-card-content">
                <span>Uploaded</span>
                <strong>{uploadedVideos}</strong>
              </div>

              <small>
                Awaiting analysis
              </small>

            </div>

          </section>


          {/* =================================================
              UPLOAD SECTION
          ================================================== */}

          <section
            id="upload"
            className="dashboard-panel upload-panel"
          >

            <div className="panel-header">

              <div>

                <span className="section-label">
                  VIDEO ANALYSIS
                </span>

                <h2>
                  Upload Athlete Video
                </h2>

                <p>
                  Upload an athlete movement video
                  for AI-powered analysis.
                </p>

              </div>

              <div className="panel-action-icon">
                ↑
              </div>

            </div>


            <div className="upload-dropzone">

              <div className="upload-cloud-icon">
                ☁
              </div>

              <h3>
                Select an athlete video
              </h3>

              <p>
                MP4, AVI, MOV or MKV
              </p>

              <input
                id="video-upload"
                type="file"
                accept=".mp4,.avi,.mov,.mkv,video/*"
                onChange={handleFileChange}
              />

              <label
                htmlFor="video-upload"
                className="choose-video-button"
              >
                Choose Video
              </label>

              {selectedFile && (
                <div className="selected-video">

                  <span>✓</span>

                  <div>
                    <strong>
                      {selectedFile.name}
                    </strong>

                    <small>
                      Ready for upload
                    </small>
                  </div>

                </div>
              )}

              <button
                className="upload-video-button"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading
                  ? 'Uploading...'
                  : 'Upload Video'}
              </button>

            </div>

            {message && (
              <div className="dashboard-message success-message">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="dashboard-message error-message">
                {error}
              </div>
            )}

          </section>


          {/* =================================================
              RISK ASSESSMENT
          ================================================== */}

          <section
            id="assessment"
            className="assessment-wrapper"
          >

            <RiskAssessment />

          </section>


          {/* =================================================
              RISK OVERVIEW
          ================================================== */}

          <section
            id="risk-overview"
            className="risk-overview-panel"
          >

            <div className="panel-header">

              <div>

                <span className="section-label">
                  AI ANALYTICS
                </span>

                <h2>
                  Risk Overview
                </h2>

                <p>
                  Current injury-risk analysis status.
                </p>

              </div>

              <div className="overview-ready">
                <span />
                System Ready
              </div>

            </div>

            <div className="risk-overview-grid">

              <div className="overview-item">

                <span className="overview-icon">
                  ◉
                </span>

                <div>
                  <strong>Pose Detection</strong>
                  <small>
                    MediaPipe analysis
                  </small>
                </div>

                <span className="overview-check">
                  ✓
                </span>

              </div>


              <div className="overview-item">

                <span className="overview-icon">
                  ◈
                </span>

                <div>
                  <strong>Feature Extraction</strong>
                  <small>
                    Biomechanical features
                  </small>
                </div>

                <span className="overview-check">
                  ✓
                </span>

              </div>


              <div className="overview-item">

                <span className="overview-icon">
                  ◇
                </span>

                <div>
                  <strong>ML Prediction</strong>
                  <small>
                    Injury risk prediction
                  </small>
                </div>

                <span className="overview-check">
                  ✓
                </span>

              </div>

            </div>

          </section>


          {/* =================================================
              ANALYSIS RESULTS
          ================================================== */}

          <section
            id="analysis-results"
            className="analysis-results-section"
          >

            {analysisResult && (
              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-label">
                      ANALYSIS RESULTS
                    </span>

                    <h2>
                      Video Analysis Results
                    </h2>

                    <p>
                      AI-generated biomechanical
                      movement analysis.
                    </p>

                  </div>

                  <div className="result-video-id">
                    Video #{analysisResult.video_id}
                  </div>

                </div>


                <div className="result-summary">

                  <div>
                    <span>Video ID</span>
                    <strong>
                      {analysisResult.video_id}
                    </strong>
                  </div>

                  <div>
                    <span>Frames Processed</span>
                    <strong>
                      {analysisResult.frames_processed}
                    </strong>
                  </div>

                </div>


                {analysisResult.features && (
                  <div className="analysis-feature-grid">

                    <div className="feature-analysis-card">

                      <h3>
                        Knee Analysis
                      </h3>

                      <p>
                        Left Knee ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.left_knee_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        Right Knee ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.right_knee_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        ROM Asymmetry
                        <strong>
                          {formatValue(
                            analysisResult.features.knee_rom_asymmetry,
                          )}°
                        </strong>
                      </p>

                    </div>


                    <div className="feature-analysis-card">

                      <h3>
                        Hip Analysis
                      </h3>

                      <p>
                        Left Hip ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.left_hip_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        Right Hip ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.right_hip_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        ROM Asymmetry
                        <strong>
                          {formatValue(
                            analysisResult.features.hip_rom_asymmetry,
                          )}°
                        </strong>
                      </p>

                    </div>


                    <div className="feature-analysis-card">

                      <h3>
                        Elbow Analysis
                      </h3>

                      <p>
                        Left Elbow ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.left_elbow_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        Right Elbow ROM
                        <strong>
                          {formatValue(
                            analysisResult.features.right_elbow_rom,
                          )}°
                        </strong>
                      </p>

                      <p>
                        ROM Asymmetry
                        <strong>
                          {formatValue(
                            analysisResult.features.elbow_rom_asymmetry,
                          )}°
                        </strong>
                      </p>

                    </div>


                    <div className="feature-analysis-card">

                      <h3>
                        Movement Dynamics
                      </h3>

                      <p>
                        Left Knee Velocity
                        <strong>
                          {formatValue(
                            analysisResult.features
                              .left_knee_max_angular_velocity,
                          )}
                        </strong>
                      </p>

                      <p>
                        Right Knee Velocity
                        <strong>
                          {formatValue(
                            analysisResult.features
                              .right_knee_max_angular_velocity,
                          )}
                        </strong>
                      </p>

                      <p>
                        Left Knee Acceleration
                        <strong>
                          {formatValue(
                            analysisResult.features
                              .left_knee_max_angular_acceleration,
                          )}
                        </strong>
                      </p>

                      <p>
                        Right Knee Acceleration
                        <strong>
                          {formatValue(
                            analysisResult.features
                              .right_knee_max_angular_acceleration,
                          )}
                        </strong>
                      </p>

                    </div>

                  </div>
                )}

              </div>
            )}

          </section>


          {/* =================================================
              VIDEO HISTORY
          ================================================== */}

          <section
            id="history"
            className="dashboard-panel history-panel"
          >

            <div className="panel-header">

              <div>

                <span className="section-label">
                  ANALYSIS HISTORY
                </span>

                <h2>
                  Recent Videos
                </h2>

                <p>
                  View and analyze your uploaded
                  athlete videos.
                </p>

              </div>

              <span className="video-count">
                {videos.length} videos
              </span>

            </div>


            {loadingVideos ? (

              <div className="empty-videos">
                <div className="empty-icon">
                  ◌
                </div>

                <h3>
                  Loading videos...
                </h3>
              </div>

            ) : videos.length === 0 ? (

              <div className="empty-videos">

                <div className="empty-icon">
                  ▣
                </div>

                <h3>
                  No videos yet
                </h3>

                <p>
                  Upload your first athlete video
                  to begin analysis.
                </p>

              </div>

            ) : (

              <div className="video-grid">

                {videos.map((video) => (

                  <div
                    className="video-history-card"
                    key={video.id}
                  >

                    <div className="video-card-top">

                      <div className="video-thumbnail">
                        ▶
                      </div>

                      <span
                        className={`video-status ${video.status}`}
                      >
                        {video.status}
                      </span>

                    </div>

                    <h3>
                      {video.original_filename}
                    </h3>

                    <p>
                      Video ID: {video.id}
                    </p>

                    <span className="video-date">
                      {video.created_at
                        ? new Date(
                            video.created_at,
                          ).toLocaleString()
                        : 'Date unavailable'}
                    </span>

                    {video.status === 'uploaded' && (
                      <button
                        className="analyze-video-button"
                        onClick={() =>
                          handleAnalyze(video.id)
                        }
                        disabled={
                          analyzingId === video.id
                        }
                      >
                        {analyzingId === video.id
                          ? 'Analyzing...'
                          : 'Analyze Video'}
                      </button>
                    )}

                    {video.status === 'completed' && (
                      <button
                        className="analyze-video-button secondary"
                        onClick={() =>
                          handleAnalyze(video.id)
                        }
                        disabled={
                          analyzingId === video.id
                        }
                      >
                        {analyzingId === video.id
                          ? 'Analyzing...'
                          : 'Analyze Again'}
                      </button>
                    )}

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="quick-actions-panel">

            <div>

              <span className="section-label">
                QUICK ACTIONS
              </span>

              <h2>
                Continue Your Analysis
              </h2>

            </div>

            <div className="quick-action-buttons">

              <button
                onClick={() => scrollTo('upload')}
              >
                ↑ Upload Video
              </button>

              <button
                onClick={() => scrollTo('assessment')}
              >
                ◈ Risk Assessment
              </button>

              <button
                onClick={() => scrollTo('history')}
              >
                ▣ View History
              </button>

            </div>

          </section>

        </main>


        {/* FOOTER */}

        <footer className="dashboard-footer">

          <span>
            🛡 Sports Injury Risk Detection System
          </span>

          <span>
            AI-Powered&nbsp; • &nbsp;Accurate&nbsp; • &nbsp;Reliable
          </span>

          <span>
            © 2026
          </span>

        </footer>

      </div>

    </div>
  )
}

export default Dashboard