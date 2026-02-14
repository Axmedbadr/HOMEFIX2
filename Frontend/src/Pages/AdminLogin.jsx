import { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin-login.css'
import '../styles/global.css'

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // ✅ Hubi in role uu yahay admin
        if (user && user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          setError('You are not authorized to access the admin dashboard');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Access the management dashboard</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <a href="/" className="back-link">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="test-credentials">For testing: Use your admin credentials</p>
        </div>
      </div>
    </div>
  );
}
