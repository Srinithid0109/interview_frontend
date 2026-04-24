import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './InterviewPage.module.css'

function InterviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [stage, setStage] = useState('setup')
  const [role, setRole] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef(null)

  const resumeText = location.state?.resumeText || ''

  async function handleStart() {
    if (role === '') {
      setError('Please select a job role')
      return
    }
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/ai/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, questionCount, resumeText })
      })

      const data = await response.json()
      setQuestions(data.questions)
      setStage('interview')

    } catch (error) {
      setError('Failed to generate questions. Please try again!')
    }

    setLoading(false)
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please use Chrome!')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = true
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setListening(true)
      setTranscript('')
    }

    recognition.onresult = (event) => {
      let fullText = ''
      for (let i = 0; i < event.results.length; i++) {
        fullText += event.results[i][0].transcript + ' '
      }
      setTranscript(fullText.trim())
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => {
      setListening(false)
      alert('Could not hear you. Please try again!')
    }

    recognition.start()
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
    }
  }

  async function handleNext() {
    if (transcript === '') {
      alert('Please record your answer first!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestion],
          answer: transcript,
          role
        })
      })

      const feedback = await response.json()

      const newAnswers = [...answers, {
        question: questions[currentQuestion],
        answer: transcript,
        score: feedback.score,
        feedback: feedback.feedback,
        tip: feedback.tip
      }]

      setAnswers(newAnswers)
      setTranscript('')

      if (currentQuestion + 1 >= questionCount) {
        navigate('/results', {
          state: { answers: newAnswers, role }
        })
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }

    } catch (error) {
      alert('Failed to get feedback. Please try again!')
    }

    setLoading(false)
  }

  // ---- SETUP STAGE ----
  if (stage === 'setup') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}> Setup Interview</h1>
          <p className={styles.subtitle}>Tell us what role you're preparing for</p>

          <label className={styles.label}>Job Role</label>
          <select
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role...</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
          </select>

          <label className={styles.label}>Number of Questions</label>
          <div className={styles.questionOptions}>
            {[5, 10, 15].map((num) => (
              <div
                key={num}
                className={`${styles.questionOption} ${questionCount === num ? styles.selected : ''}`}
                onClick={() => setQuestionCount(num)}
              >
                <p className={styles.optionNumber}>{num}</p>
                <p className={styles.optionLabel}>
                  {num === 5 ? 'Quick' : num === 10 ? 'Standard' : 'Deep Dive'}
                </p>
              </div>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.button}
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? '⏳ Generating Questions...' : ' Start Interview'}
          </button>

          <p className={styles.back} onClick={() => navigate('/resume')}>
            ← Back
          </p>
        </div>
      </div>
    )
  }

  // ---- INTERVIEW STAGE ----
  if (stage === 'interview') {
    const progress = ((currentQuestion + 1) / questionCount) * 100

    return (
      <div className={styles.interviewContainer}>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <p className={styles.topRole}> {role}</p>
          <p className={styles.topProgress}>
            {currentQuestion + 1} / {questionCount}
          </p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Content */}
        <div className={styles.interviewContent}>

          {/* Question Card */}
          <div className={styles.questionCard}>
            <p className={styles.questionNumber}>Question {currentQuestion + 1}</p>
            <p className={styles.questionText}>
              {questions[currentQuestion]}
            </p>
          </div>

          {/* Voice Section */}
          <div className={styles.voiceSection}>
            <div className={`${styles.micCircle} ${listening ? styles.micCircleActive : ''}`}>
              <span className={styles.micIcon}>🎤</span>
              {listening && (
                <>
                  <div className={styles.ring1} />
                  <div className={styles.ring2} />
                  <div className={styles.ring3} />
                </>
              )}
            </div>

            <p className={styles.voiceStatus}>
              {listening ? 'Listening... speak your answer' : transcript ? 'Answer recorded! ✅' : 'Click the mic to start answering'}
            </p>

            <div className={styles.voiceButtons}>
              {!listening ? (
                <button className={styles.micButton} onClick={startListening}>
                  🎤 Start Answering
                </button>
              ) : (
                <button className={styles.stopButton} onClick={stopListening}>
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {transcript !== '' && (
              <div className={styles.transcriptBox}>
                <p className={styles.transcriptLabel}>Your Answer 📝</p>
                <p className={styles.transcriptText}>{transcript}</p>
                <p className={styles.reRecord} onClick={startListening}>
                   Re-record answer
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            className={`${styles.nextButton} ${transcript === '' || loading ? styles.nextDisabled : ''}`}
            onClick={handleNext}
            disabled={transcript === '' || loading}
          >
            {loading ? '⏳ Getting Feedback...' : currentQuestion + 1 >= questionCount ? '✅ Finish Interview' : 'Next Question →'}
          </button>

        </div>
      </div>
    )
  }
}

export default InterviewPage