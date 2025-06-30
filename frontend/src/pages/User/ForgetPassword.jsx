import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/account/user/forgot_password/', {
        email: email.trim().toLowerCase(),
      });

      const data = res.data;

      if (data?.id) {
        alert(data.message || 'OTP sent to your email.');
        navigate(`/forget-otp/${data.id}`);
      } else {
        
        alert('OTP sent to your email.');
        navigate('/forget-otp');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'No account found with this email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="text-center mb-6">
          <img
            src="/favicon.svg"
            alt="QuickBlog"
            className="w-12 h-12 mx-auto mb-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
            Forgot Password
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Enter your email to receive a reset OTP
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset OTP'
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
