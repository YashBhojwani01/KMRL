import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Train, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Login successful! Redirecting to dashboard...';
      document.body.appendChild(successMessage);
      
      // Remove success message after 2 seconds and redirect
      setTimeout(() => {
        document.body.removeChild(successMessage);
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements for White Mode */}
      <div className="absolute inset-0">
        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-indigo-100/20"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-100/30 via-transparent to-blue-100/25"></div>
        
        {/* Enhanced Grid with Multiple Layers */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        {/* Enhanced Geometric Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-blue-200/60 rounded-full shadow-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-slate-300/50 rounded-full shadow-sm"></div>
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gradient-to-br from-blue-100/60 to-indigo-100/40 rounded-xl rotate-45 shadow-sm"></div>
        <div className="absolute top-1/6 right-1/6 w-16 h-16 bg-gradient-to-tr from-slate-200/40 to-blue-200/30 rounded-lg rotate-12"></div>
        
        {/* Enhanced Metro Line Pattern */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-300/50 to-transparent shadow-sm"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-slate-400/50 to-transparent shadow-sm"></div>
        
        {/* Enhanced Railway Track Elements */}
        <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent shadow-sm"></div>
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent shadow-sm"></div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/30 to-transparent transform rotate-12 origin-left"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-slate-300/30 to-transparent transform -rotate-12 origin-right"></div>
        
        {/* Metro Route Map Graphics */}
        <svg className="absolute top-10 left-10 w-40 h-40 opacity-35" viewBox="0 0 128 128">
          <path d="M20 20 L60 20 L60 60 L108 60" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="6,4"/>
          <circle cx="20" cy="20" r="5" fill="#3b82f6"/>
          <circle cx="60" cy="20" r="5" fill="#3b82f6"/>
          <circle cx="60" cy="60" r="5" fill="#3b82f6"/>
          <circle cx="108" cy="60" r="5" fill="#3b82f6"/>
          <text x="15" y="35" fontSize="8" fill="#3b82f6" opacity="0.7">A</text>
          <text x="55" y="35" fontSize="8" fill="#3b82f6" opacity="0.7">B</text>
          <text x="55" y="75" fontSize="8" fill="#3b82f6" opacity="0.7">C</text>
          <text x="103" y="75" fontSize="8" fill="#3b82f6" opacity="0.7">D</text>
        </svg>
        
        <svg className="absolute bottom-16 right-12 w-48 h-32 opacity-25" viewBox="0 0 160 96">
          <path d="M10 48 Q40 20 80 48 T150 48" stroke="#64748b" strokeWidth="3" fill="none"/>
          <rect x="65" y="33" width="30" height="30" rx="6" fill="#64748b" opacity="0.4"/>
          <rect x="72" y="40" width="16" height="16" rx="3" fill="#3b82f6" opacity="0.6"/>
          <circle cx="80" cy="70" r="3" fill="#64748b" opacity="0.5"/>
          <circle cx="88" cy="70" r="3" fill="#64748b" opacity="0.5"/>
        </svg>
        
        {/* Architectural Elements */}
        <svg className="absolute top-1/3 right-16 w-32 h-56 opacity-18" viewBox="0 0 96 192">
          <rect x="8" y="20" width="12" height="152" fill="#64748b"/>
          <rect x="76" y="20" width="12" height="152" fill="#64748b"/>
          <rect x="20" y="30" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="50" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="70" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="90" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="110" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="130" width="56" height="3" fill="#64748b"/>
          <rect x="20" y="150" width="56" height="3" fill="#64748b"/>
          
          {/* Decorative arch */}
          <path d="M20 30 Q48 10 76 30" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5"/>
        </svg>
        
        {/* Transit Icons */}
        <div className="absolute top-1/4 left-16">
          <svg className="w-20 h-20 opacity-15" viewBox="0 0 64 64">
            <rect x="8" y="12" width="48" height="40" rx="8" fill="#3b82f6"/>
            <rect x="12" y="16" width="10" height="10" rx="2" fill="white" opacity="0.8"/>
            <rect x="22" y="16" width="10" height="10" rx="2" fill="white" opacity="0.8"/>
            <rect x="32" y="16" width="10" height="10" rx="2" fill="white" opacity="0.8"/>
            <rect x="42" y="16" width="10" height="10" rx="2" fill="white" opacity="0.8"/>
            <rect x="12" y="28" width="40" height="2" fill="white" opacity="0.6"/>
            <circle cx="18" cy="54" r="5" fill="#64748b"/>
            <circle cx="46" cy="54" r="5" fill="#64748b"/>
            <rect x="20" y="34" width="24" height="12" rx="2" fill="white" opacity="0.3"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-28">
          <svg className="w-16 h-16 opacity-15" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#3b82f6" strokeWidth="2"/>
            <circle cx="24" cy="24" r="4" fill="#3b82f6"/>
            <line x1="24" y1="6" x2="24" y2="16" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="24" y1="32" x2="24" y2="42" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="6" y1="24" x2="16" y2="24" stroke="#3b82f6" strokeWidth="2"/>
            <line x1="32" y1="24" x2="42" y2="24" stroke="#3b82f6" strokeWidth="2"/>
            <circle cx="24" cy="8" r="2" fill="#3b82f6"/>
            <circle cx="24" cy="40" r="2" fill="#3b82f6"/>
            <circle cx="8" cy="24" r="2" fill="#3b82f6"/>
            <circle cx="40" cy="24" r="2" fill="#3b82f6"/>
          </svg>
        </div>
        
        {/* Additional Metro Elements */}
        <div className="absolute top-1/2 left-8">
          <svg className="w-12 h-32 opacity-12" viewBox="0 0 48 128">
            <rect x="20" y="0" width="8" height="128" fill="#64748b"/>
            <circle cx="24" cy="16" r="6" fill="#3b82f6" opacity="0.6"/>
            <circle cx="24" cy="48" r="6" fill="#3b82f6" opacity="0.6"/>
            <circle cx="24" cy="80" r="6" fill="#3b82f6" opacity="0.6"/>
            <circle cx="24" cy="112" r="6" fill="#3b82f6" opacity="0.6"/>
          </svg>
        </div>
      </div>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-6 shadow-lg">
            <Train className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KMRL Insights</h1>
          <p className="text-gray-600">Kochi Metro Rail Limited</p>
        </div>

        {/* Enhanced Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden relative">
          {/* Card accent border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-blue-50/60 border-t border-gray-200/60 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-indigo-500/2"></div>
            <p className="text-center text-sm text-gray-600 relative z-10">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Sign up here!
              </a>
            </p>
          </div>
        </div>

        {/* Enhanced Security Information */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 text-sm bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow duration-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Enterprise Security • SOC 2 Compliant</span>
          </div>
        </div>

        {/* Enhanced Organization Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/40">
            <Building2 className="w-4 h-4 text-blue-500" />
            <span>Government of Kerala • Public Transportation Authority</span>
          </div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-300/60 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-300/60 rounded-full"></div>
          <div className="w-2 h-2 bg-indigo-300/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
