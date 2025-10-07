import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'https://your-backend.onrender.com'

export default function Student() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [text, setText] = useState('')
  const [selected, setSelected] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  async function load() {
    try {
      const qs = await axios.get(`${API}/api/questions`, { headers: { Authorization: `Bearer ${token}` } })
      setQuestions(qs.data)
      const as = await axios.get(`${API}/api/answers/mine`, { headers: { Authorization: `Bearer ${token}` } })
      setAnswers(as.data)
    } catch (err) {
      setMessage('❌ Failed to load data')
    }
  }

  async function submit() {
    if (!selected || !text.trim()) return
    
    setIsLoading(true)
    setMessage('')
    try {
      await axios.post(`${API}/api/answers`, { questionId: selected, text }, { headers: { Authorization: `Bearer ${token}` } })
      setText('')
      setSelected('')
      setMessage('✅ Answer submitted successfully!')
      load()
    } catch (err) {
      setMessage('❌ Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }

  function getCategoryColor(category) {
    switch (category) {
      case 'Correct': return 'bg-green-100 text-green-800'
      case 'Partially Correct': return 'bg-yellow-100 text-yellow-800'
      case 'Incorrect': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getScoreColor(score) {
    if (score >= 0.75) return 'text-green-600'
    if (score >= 0.45) return 'text-yellow-600'
    return 'text-red-600'
  }

  useEffect(() => { 
    if (!token) {
      window.location.href = '/login'
      return
    }
    load() 
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">👨‍🎓 Student Dashboard</h1>
              <p className="text-gray-600 text-lg">Submit answers and track your learning progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('role')
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
                className="btn-secondary"
              >
                🚪 Logout
              </button>
              <Link to="/" className="btn-secondary">
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit Answer Section */}
          <div className="floating-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📝 Submit New Answer</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Question
                </label>
                <select 
                  value={selected} 
                  onChange={e => setSelected(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a question...</option>
                  {questions.map(q => (
                    <option key={q._id} value={q._id}>
                      {q.text.length > 60 ? q.text.slice(0, 60) + '...' : q.text}
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea 
                    rows={6}
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="Write your answer here..."
                    className="input-field resize-none"
                  />
                </div>
              )}

              <button 
                disabled={!selected || !text.trim() || isLoading}
                onClick={submit}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Answer'
                )}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-lg ${
                  message.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Submissions History */}
          <div className="floating-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📊 My Submissions</h2>
            </div>
            
            {answers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No submissions yet</p>
                <p className="text-sm text-gray-400">Submit your first answer to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map(a => (
                  <div key={a._id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg">
                        {a.question?.text || 'Question not found'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(a.category)}`}>
                        {a.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {a.text}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold text-lg ${getScoreColor(a.score)}`}>
                          📊 {a.score ? (a.score * 100).toFixed(1) + '%' : 'N/A'}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              a.score >= 0.75 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              a.score >= 0.45 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ width: `${(a.score || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        📅 {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


