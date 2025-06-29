import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/token';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number must contain only digits";
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${BASE_URL}account/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password
        }),
      });

      const data = await response.json();
      console.log(data, 'Registration response');

      if (!response.ok) {
        throw new Error(
          data.email ||
          data.phone ||
          data.message ||
          'Registration failed'
        );
      }

      alert('Registration successful. Please check your email for OTP.');
      const userId = data?.id || data?.user_id;
      navigate(userId ? `/otp/${userId}` : '/otp');
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="mb-6 text-center">
          <img
            src="/favicon.ico"
            alt="QuickBlog"
            className="w-12 h-12 mx-auto mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">QuickBlog</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Create your account
          </p>
        </div>

        {errors.server && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.server}
          </p>
        )}

        <form onSubmit={signupSubmit} className="space-y-4" noValidate>
          <div>
            {errors.username && (
              <p className="text-red-500 text-sm mb-1">{errors.username}</p>
            )}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            {errors.email && (
              <p className="text-red-500 text-sm mb-1">{errors.email}</p>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            {errors.phone && (
              <p className="text-red-500 text-sm mb-1">{errors.phone}</p>
            )}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-1">{errors.password}</p>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-1">
                {errors.confirmPassword}
              </p>
            )}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>

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
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
