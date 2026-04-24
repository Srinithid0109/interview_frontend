import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ResultsPage.module.css'

function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const answers = location.state?.answers || []
  const role = location.state?.role || 'Interview'

  const results = answers.map((item) => ({
    ...item,
    score: item.score || 0,
    feedback: item.feedback || 'No feedback available',
    tip: item.tip || 'Keep practicing!'
  }))


    useEffect(() => {
  async function saveResults() {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (!storedUser || answers.length === 0) return

    const overall = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0

    try {
      await fetch('http://localhost:5000/api/results/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUser.id,
          role,
          answers: results,
          overallScore: overall
        })
      })
      console.log('Results saved!')
    } catch (error) {
      console.error('Failed to save results:', error)
    }
  }
  saveResults()
}, [])

  const overallScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0

  function getScoreColor(score) {
    if (score >= 80) return styles.scoreGreen
    if (score >= 60) return styles.scoreYellow
    return styles.scoreRed
  }

  function getScoreEmoji(score) {
    if (score >= 80) return '🟢'
    if (score >= 60) return '🟡'
    return '🔴'
  }

  function getScoreLabel(score) {
    if (score >= 80) return 'Great answer!'
    if (score >= 60) return 'Good but could improve'
    return 'Needs improvement'
  }

  function getStars(score) {
    if (score >= 85) return '⭐⭐⭐⭐⭐'
    if (score >= 70) return '⭐⭐⭐⭐'
    if (score >= 60) return '⭐⭐⭐'
    return '⭐⭐'
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>

        <div className={styles.header}>
          <h1 className={styles.title}>🎉 Interview Complete!</h1>
          <p className={styles.role}>{role}</p>
        </div>

        <div className={styles.overallCard}>
          <p className={styles.overallLabel}>Overall Score</p>
          <p className={styles.overallScore}>{overallScore}%</p>
          <p className={styles.overallStars}>{getStars(overallScore)}</p>
          <p className={styles.overallMessage}>
            {overallScore >= 80
              ? '🔥 Excellent performance! You are well prepared!'
              : overallScore >= 60
              ? '👍 Good effort! Keep practicing to improve!'
              : '💪 Keep going! Practice makes perfect!'}
          </p>
        </div>

        <div className={styles.resultsList}>
          <h2 className={styles.sectionTitle}>Detailed Feedback</h2>

          {results.map((item, index) => (
            <div key={index} className={styles.resultCard}>

              <div className={styles.questionRow}>
                <span className={styles.questionNumber}>Q{index + 1}</span>
                <p className={styles.questionText}>{item.question}</p>
              </div>

              <div className={styles.answerBox}>
                <p className={styles.answerLabel}>Your Answer</p>
                <p className={styles.answerText}>{item.answer}</p>
              </div>

              <div className={styles.scoreRow}>
                <span className={styles.scoreEmoji}>{getScoreEmoji(item.score)}</span>
                <span className={`${styles.scoreBadge} ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
                <span className={styles.scoreLabel}>{getScoreLabel(item.score)}</span>
              </div>

              <div className={styles.feedbackBox}>
                <p className={styles.feedbackText}>💬 {item.feedback}</p>
                <p className={styles.tipText}>💡 {item.tip}</p>
              </div>

            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.tryAgainButton}
            onClick={() => navigate('/resume')}
          >
            Try Again
          </button>
          <button
            className={styles.dashboardButton}
            onClick={() => navigate('/dashboard')}
          >
            🏠 Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResultsPage