import { useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/predict'

function App() {
  const [emailInput, setEmailInput] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setError(null)
    setPrediction(null)

    if (!emailInput.trim()) {
      setError('Please enter an email message before checking.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the backend. Is the API running at http://127.0.0.1:8000?'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="detector-container">
      <main className="detector-card">
        <h1>AI Email Spam Detector</h1>
        <p className="subtitle">
          Paste an email below to check whether it is{' '}
          <strong>Spam</strong> or <strong>Not Spam</strong>.
        </p>

        <form onSubmit={handleCheckEmail} className="detector-form">
          <label htmlFor="email-input" className="sr-only">
            Email message
          </label>
          <textarea
            id="email-input"
            className="detector-textarea"
            placeholder="Paste email content here..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            rows={10}
            disabled={loading}
            aria-busy={loading}
          />

          <div className="detector-actions">
            <button
              type="submit"
              className="detector-button"
              disabled={loading || !emailInput.trim()}
            >
              {loading ? 'Checking...' : 'Check Email'}
            </button>
          </div>

          {loading && (
            <div className="detector-loading" role="status" aria-label="Loading">
              <div className="spinner"></div>
              <span>Analyzing email…</span>
            </div>
          )}

          {error && (
            <div className="detector-error" role="alert">
              {error}
            </div>
          )}

          {prediction && (
            <div
              className={`detector-result ${prediction === 'SPAM' ? 'result-spam' : 'result-not-spam'}`}
            >
              {prediction === 'SPAM' ? '🚫 SPAM' : '✅ NOT SPAM'}
            </div>
          )}
        </form>
      </main>
    </div>
  )
}

export default App
