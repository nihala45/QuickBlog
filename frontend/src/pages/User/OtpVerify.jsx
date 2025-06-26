import React, { useState } from 'react';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }

    // Simulate OTP match (you'd normally call an API here)
    if (otp === '123456') {
      alert('OTP verified successfully!');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/favicon.ico" alt="QuickBlog" className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-700">Verify OTP</h1>
          <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Didn’t receive the code? <span className="text-blue-600 hover:underline cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
