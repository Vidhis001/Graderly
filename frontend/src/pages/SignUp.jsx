import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function signUp() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage('❌ Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match')
      return
    }

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setMessage('')
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
        role
      })
      
      setMessage('✅ Account created successfully! Redirecting to login...')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create account'
      setMessage(`❌ ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Create Account</h2>
              <p className="text-white/80 text-lg">Join our AI-powered learning platform</p>
            </Link>
          </div>

          <div className="floating-card p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                  👤 Select Your Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-field"
                >
                  <option value="teacher">👨‍🏫 Teacher</option>
                  <option value="student">👨‍🎓 Student</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  👤 Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  🔒 Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  🔒 Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                onClick={signUp}
                disabled={isLoading || !name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  '🚀 Create Account'
                )}
              </button>

              {message && (
                <div className={`text-center p-4 rounded-xl font-medium ${
                  message.includes('✅') 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-2 border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                    Sign In
                  </Link>
                </p>
                <Link to="/" className="block text-blue-600 hover:text-blue-700 font-semibold text-sm mt-2 transition-colors duration-200">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
