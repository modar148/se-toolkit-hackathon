import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/services';
import { useUser } from '../context/UserContext';
import { Alert } from '../components/shared';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(
        formData.fullName,
        formData.email,
        formData.password
      );
      
      setSuccess(true);
      loginUser(response.data);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.fieldErrors?.email?.[0] ||
                       'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body p-5">
            <h2 className="card-title mb-4 text-center">Create an Account</h2>
            
            {success && (
              <Alert
                type="success"
                message="Registration successful! Redirecting..."
              />
            )}
            
            {error && (
              <Alert
                type="danger"
                message={error}
                onClose={() => setError(null)}
                autoClose={false}
              />
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <hr />

            <p className="text-center text-muted">
              Already have an account? Use the user menu to log in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
