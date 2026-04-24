import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0
  })
  const [recentResults, setRecentResults] = useState([])

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          `https://interview-backend-jscm.onrender.com/api/results/stats/${storedUser.id}`
        )
        const data = await response.json()
        setStats({
          totalInterviews: data.stats.totalInterviews || 0,
          averageScore: data.stats.averageScore || 0,
          bestScore: data.stats.bestScore || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    async function fetchRecent() {
      try {
        const response = await fetch(
          `https://interview-backend-jscm.onrender.com/api/results/${storedUser.id}`
        )
        const data = await response.json()
        setRecentResults(data.results.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch recent results:', error)
      }
    }

    fetchStats()
    fetchRecent()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcome}>Welcome, {storedUser?.name}!</h1>
          <p className={styles.subtitle}>Ready to practice today?</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
          <button className={styles.startButton} onClick={() => navigate('/resume')}>
             Start New Interview
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.totalInterviews}</p>
          <p className={styles.statLabel}>Total Interviews</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.averageScore}%</p>
          <p className={styles.statLabel}>Average Score</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.bestScore}%</p>
          <p className={styles.statLabel}>Best Score</p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Interviews</h2>

        {recentResults.length === 0 ? (
          <p style={{ color: '#6b6b8a', textAlign: 'center', padding: '20px' }}>
            No interviews yet! Start your first one 
          </p>
        ) : (
          recentResults.map((result) => (
            <div key={result.id} className={styles.interviewCard}>
              <div>
                <p className={styles.role}>{result.role}</p>
                <p className={styles.date}>
                  {new Date(result.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.scoreBadge}>
                {result.overall_score || 0}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage
