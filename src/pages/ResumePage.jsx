import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ResumePage.module.css'

function ResumePage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  function handleFile(selectedFile) {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only!')
      setFile(null)
      return
    }
    setError('')
    setFile(selectedFile)
  }

  function handleFileInput(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) handleFile(selectedFile)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const selectedFile = e.dataTransfer.files[0]
    if (selectedFile) handleFile(selectedFile)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleContinue() {
    if (!file) {
      setError('Please upload your resume first!')
      return
    }
    // Later we'll send this to backend
    console.log('Resume file:', file.name)
    navigate('/interview')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title}> Upload Your Resume</h1>
        <p className={styles.subtitle}>
          We'll use your resume to generate personalised interview questions
        </p>

        {/* Drop Zone */}
        <div
          className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${file ? styles.uploaded : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {file ? (
            <div className={styles.fileInfo}>
              <p className={styles.fileIcon}></p>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className={styles.dropText}>
              <p className={styles.dropIcon}>📂</p>
              <p className={styles.dropMain}>
                {dragging ? 'Drop it here!' : 'Drag & drop your resume here'}
              </p>
              <p className={styles.dropSub}>or click to browse</p>
              <p className={styles.dropFormat}>PDF files only</p>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />

        {/* Change file option */}
        {file && (
          <p
            className={styles.changeFile}
            onClick={() => document.getElementById('fileInput').click()}
          >
             Change file
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.button} ${!file ? styles.buttonDisabled : ''}`}
          onClick={handleContinue}
          disabled={!file}
        >
          Continue to Interview →
        </button>

        <p className={styles.back} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </p>

      </div>
    </div>
  )
}

export default ResumePage