import { useState } from 'react'

function RiskAssessment() {
  const [form, setForm] = useState({
    speed_r: 2.8,
    age: 25,
    Height: 175,
    Weight: 70,
    Gender: 'Male',
    DominantLeg: 'Right',
    Activities: 'running',
    Level: 'Recreational',
    YrsRunning: 5,
    RaceDistance: '10K',
    YrPR: 2024,
    NumRaces: 5,
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    const numericFields = [
      'speed_r',
      'age',
      'Height',
      'Weight',
      'YrsRunning',
      'YrPR',
      'NumRaces',
    ]

    setForm((previous) => ({
      ...previous,
      [name]: numericFields.includes(name)
        ? Number(value)
        : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction failed')
      }

      setResult(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="upload-card">
      <h2>Injury Risk Assessment</h2>

      <p>
        Enter athlete information to estimate injury risk.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <input
          type="number"
          name="Height"
          placeholder="Height (cm)"
          value={form.Height}
          onChange={handleChange}
        />

        <input
          type="number"
          name="Weight"
          placeholder="Weight (kg)"
          value={form.Weight}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          name="speed_r"
          placeholder="Running Speed"
          value={form.speed_r}
          onChange={handleChange}
        />

        <select
          name="Gender"
          value={form.Gender}
          onChange={handleChange}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Unknown</option>
        </select>

        <select
          name="DominantLeg"
          value={form.DominantLeg}
          onChange={handleChange}
        >
          <option>Right</option>
          <option>Left</option>
        </select>

        <input
          type="text"
          name="Activities"
          placeholder="Activities"
          value={form.Activities}
          onChange={handleChange}
        />

        <select
          name="Level"
          value={form.Level}
          onChange={handleChange}
        >
          <option>Recreational</option>
          <option>Competitive</option>
        </select>

        <input
          type="number"
          name="YrsRunning"
          placeholder="Years Running"
          value={form.YrsRunning}
          onChange={handleChange}
        />

        <input
          type="text"
          name="RaceDistance"
          placeholder="Race Distance"
          value={form.RaceDistance}
          onChange={handleChange}
        />

        <input
          type="number"
          name="YrPR"
          placeholder="Personal Record Year"
          value={form.YrPR}
          onChange={handleChange}
        />

        <input
          type="number"
          name="NumRaces"
          placeholder="Number of Races"
          value={form.NumRaces}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Injury Risk'}
        </button>

      </form>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {result && (
        <div className="risk-result">
          <h3>{result.prediction}</h3>

          <p>
            Risk Probability:{' '}
            <strong>{result.risk_probability}%</strong>
          </p>
        </div>
      )}
    </section>
  )
}

export default RiskAssessment