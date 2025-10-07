import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'https://your-backend.onrender.com'

export default function Teacher() {
  const token = localStorage.getItem('token')
  const [text, setText] = useState('Explain photosynthesis.')
  const [ref, setRef] = useState('Photosynthesis converts light energy into chemical energy in plants.')
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    try {
      const qs = await axios.get(`${API}/api/questions`, { headers: { Authorization: `Bearer ${token}` } })
      setQuestions(qs.data)
    } catch (err) {
      setMessage('❌ Failed to load questions')
    }
  }

  async function createQ() {
    if (!text.trim() || !ref.trim()) return
    
    setIsLoading(true)
    setMessage('')
    try {
      console.log('Creating question with:', { text, referenceAnswer: ref })
      console.log('Token:', token ? 'Present' : 'Missing')
      console.log('API URL:', `${API}/api/questions`)
      
      const response = await axios.post(`${API}/api/questions`, { text, referenceAnswer: ref }, { headers: { Authorization: `Bearer ${token}` } })
      console.log('Response:', response.data)
      
      setText('')
      setRef('')
      setMessage('✅ Question created successfully!')
      load()
    } catch (err) {
      console.error('Error creating question:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
      setMessage(`❌ Failed to create question: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { 
    if (!token) {
      window.location.href = '/login'
      return
    }
    load() 
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">👨‍🏫 Teacher Dashboard</h1>
              <p className="text-gray-600 text-lg">Create questions and manage student submissions</p>
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
          {/* Create Question Section */}
          <div className="floating-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📝 Create New Question</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea 
                  rows={4}
                  value={text} 
                  onChange={e => setText(e.target.value)} 
                  placeholder="Enter the question students will answer..."
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Answer
                </label>
                <textarea 
                  rows={4}
                  value={ref} 
                  onChange={e => setRef(e.target.value)} 
                  placeholder="Enter the ideal answer for comparison..."
                  className="input-field resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used as the reference for AI grading
                </p>
              </div>

              <button 
                disabled={!text.trim() || !ref.trim() || isLoading}
                onClick={createQ}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Create Question'
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

          {/* Questions List */}
          <div className="floating-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📚 Your Questions</h2>
            </div>
            
            {questions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No questions yet</p>
                <p className="text-sm text-gray-400">Create your first question to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map(q => (
                  <div key={q._id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 text-lg">
                        {q.text}
                      </h3>
                      <span className="text-sm text-gray-500 ml-4">
                        📅 {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reference Answer:
                      </p>
                      <p className="text-sm text-blue-700 line-clamp-3 leading-relaxed">
                        {q.referenceAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold gradient-text mb-2">{questions.length}</h3>
            <p className="text-gray-600 text-lg font-medium">📝 Questions Created</p>
          </div>

          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold gradient-text mb-2">0</h3>
            <p className="text-gray-600 text-lg font-medium">📊 Student Submissions</p>
          </div>

          <div className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold gradient-text mb-2">🤖</h3>
            <p className="text-gray-600 text-lg font-medium">AI Grading Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}


