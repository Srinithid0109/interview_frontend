import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './RegisterPage.module.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleRegister() {
    if (name === '' || email === '' || password === '') {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()
      console.log('Response:', data)
      console.log('Status:', response.ok)

      if (!response.ok) {
        setError(data.message)
        return
      }

      navigate('/')

    } catch (error) {
      setError('Something went wrong. Please try again!')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start your interview prep today</p>

        <input
          className={styles.input}
          type="text"
          placeholder="Full Names"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} onClick={handleRegister}>
          Create Account
        </button>

        <p className={styles.switch}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')}>Login</span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage