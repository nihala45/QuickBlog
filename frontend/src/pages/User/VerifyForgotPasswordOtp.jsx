import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';

const VerifyForgotPasswordOtp = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError(null);

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit numeric OTP.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        `/account/user/verify_forgot_password_otp/${id}/`,
        {
          email_otp: otp,
        }
      );

      alert(res.data?.message || 'OTP verified successfully!');
      navigate(`/reset-password/${id}`); 
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Invalid OTP. Please try again.'
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
            Verify OTP
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Enter the 6-digit OTP sent to your email.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
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
                Verifying...
              </span>
            ) : (
              'Verify OTP'
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

export default VerifyForgotPasswordOtp;
