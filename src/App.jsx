import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InterviewPage from './pages/InterviewPage'
import ResumePage from './pages/ResumePage'
import ResultsPage from './pages/ResultsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/resume" element={
        <ProtectedRoute>
          <ResumePage />
        </ProtectedRoute>
      } />
      <Route path="/interview" element={
        <ProtectedRoute>
          <InterviewPage />
        </ProtectedRoute>
      } />
      <Route path="/results" element={
        <ProtectedRoute>
          <ResultsPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App