import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/services';
import { useUser } from '../context/UserContext';
import { LoadingSpinner, Alert } from '../components/shared';
import { Layout } from '../components/Layout';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser: setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      setUser(user);
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again later.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Login</h2>

                {error && (
                  <Alert type="danger" message={error} />
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Login'}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
