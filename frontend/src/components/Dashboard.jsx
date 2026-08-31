import { useEffect, useState } from 'react'
import RiskAssessment from './RiskAssessment'

function Dashboard({ onLogout }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState(null)

  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [analysisResult, setAnalysisResult] = useState(null)

  const fetchVideos = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('You are not authenticated. Please login again.')
      setLoadingVideos(false)
      return
    }

    try {
      const response = await fetch(
        'http://localhost:8000/videos/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load videos')
      }

      setVideos(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoadingVideos(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
    setMessage('')
    setError('')
    setAnalysisResult(null)
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
      const response = await fetch(
        'http://localhost:8000/videos/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Video upload failed')
      }

      setMessage(
        `Video uploaded successfully. Video ID: ${data.video_id}`,
      )

      setSelectedFile(null)

      await fetchVideos()
    } catch (error) {
      setError(error.message)
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
        `http://localhost:8000/videos/${videoId}/analyze`,
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
    } catch (error) {
      setError(error.message)
    } finally {
      setAnalyzingId(null)
    }
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A'
    }

    return Number(value).toFixed(2)
  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>Sports Injury Risk Detection</h1>
          <p>Athlete Analysis Dashboard</p>
        </div>

        <button
          className="secondary-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>


      <main className="dashboard-content">

        {/* Video Upload */}
        <section className="upload-card">
          <h2>Upload Athlete Video</h2>

          <p>
            Upload a video of an athlete for movement and injury
            risk analysis.
          </p>

          <input
            type="file"
            accept=".mp4,.avi,.mov,.mkv,video/*"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <p>
              Selected file: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <button
            className="primary-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
        </section>


        {/* ML Risk Assessment */}
        <RiskAssessment />


        {/* Video Analysis Results */}
        {analysisResult && (
          <section className="upload-card">
            <h2>Video Analysis Results</h2>

            <p>
              <strong>Video ID:</strong>{' '}
              {analysisResult.video_id}
            </p>

            <p>
              <strong>Frames Processed:</strong>{' '}
              {analysisResult.frames_processed}
            </p>

            <h3>Biomechanical Features</h3>

            <div className="video-list">

              <div className="video-card">
                <h4>Knee Analysis</h4>

                <p>
                  Left Knee ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.left_knee_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Right Knee ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.right_knee_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Knee ROM Asymmetry:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.knee_rom_asymmetry,
                    )}°
                  </strong>
                </p>
              </div>


              <div className="video-card">
                <h4>Hip Analysis</h4>

                <p>
                  Left Hip ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.left_hip_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Right Hip ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.right_hip_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Hip ROM Asymmetry:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.hip_rom_asymmetry,
                    )}°
                  </strong>
                </p>
              </div>


              <div className="video-card">
                <h4>Elbow Analysis</h4>

                <p>
                  Left Elbow ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.left_elbow_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Right Elbow ROM:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.right_elbow_rom,
                    )}°
                  </strong>
                </p>

                <p>
                  Elbow ROM Asymmetry:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features.elbow_rom_asymmetry,
                    )}°
                  </strong>
                </p>
              </div>


              <div className="video-card">
                <h4>Movement Dynamics</h4>

                <p>
                  Left Knee Max Velocity:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features
                        .left_knee_max_angular_velocity,
                    )}°/s
                  </strong>
                </p>

                <p>
                  Right Knee Max Velocity:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features
                        .right_knee_max_angular_velocity,
                    )}°/s
                  </strong>
                </p>

                <p>
                  Left Knee Max Acceleration:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features
                        .left_knee_max_angular_acceleration,
                    )}°/s²
                  </strong>
                </p>

                <p>
                  Right Knee Max Acceleration:{' '}
                  <strong>
                    {formatValue(
                      analysisResult.features
                        .right_knee_max_angular_acceleration,
                    )}°/s²
                  </strong>
                </p>
              </div>

            </div>
          </section>
        )}


        {/* Uploaded Videos */}
        <section className="videos-section">
          <h2>My Videos</h2>

          {loadingVideos ? (
            <p>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            <div className="video-list">

              {videos.map((video) => (
                <div
                  className="video-card"
                  key={video.id}
                >

                  <h3>{video.original_filename}</h3>

                  <p>
                    <strong>Status:</strong>{' '}
                    {video.status}
                  </p>

                  <p>
                    <strong>Video ID:</strong>{' '}
                    {video.id}
                  </p>

                  <p>
                    <strong>Uploaded:</strong>{' '}
                    {new Date(
                      video.created_at,
                    ).toLocaleString()}
                  </p>

                  {video.status === 'uploaded' && (
                    <button
                      className="primary-button"
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

                </div>
              ))}

            </div>
          )}
        </section>

      </main>
    </div>
  )
}

export default Dashboard