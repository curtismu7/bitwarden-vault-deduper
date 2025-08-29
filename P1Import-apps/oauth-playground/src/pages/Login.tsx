import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiLogIn, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray50};
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const LoginHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => #gray200};
  text-align: center;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => "#111"};
  }
`;

const LoginBody = styled.div`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => "#495057"};
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid ${({ theme }) => #gray300};
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => "#007bff"};
      box-shadow: 0 0 0 3px ${({ theme }) => "#007bff40"};
    }
    
    &::placeholder {
      color: ${({ theme }) => #gray400};
    }
    
    &:disabled {
      background-color: ${({ theme }) => "#f8f9fa"};
      cursor: not-allowed;
    }
  }
  
  .error {
    color: ${({ theme }) => "#dc3545"};
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

const ErrorIcon = styled(FiAlertCircle)`
  font-size: 3rem;
  color: ${({ theme }) => "#dc3545"};
  margin-bottom: 1.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: ${({ theme }) => "#007bff"};
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => "#0056b3"};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => "#007bff"};
  text-decoration: none;
  font-size: 0.9375rem;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: flex-start;
  background-color: ${({ theme }) => `${#dc3545}10`};
  border: 1px solid ${({ theme }) => `${#dc3545}20`};
  color: ${({ theme }) => "#dc3545"};
  
  svg {
    margin-right: 0.75rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
  
  div {
    flex: 1;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would validate the credentials with your backend
      // For demo purposes, we'll simulate a successful login
      const result = await login({ email, password });
      
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
      } else {
        // The login function will handle the navigation
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Sign in to OAuth Playground</h1>
        </LoginHeader>
        
        <LoginBody>
          {error && (
            <Alert>
              <FiAlertCircle size={20} />
              <div>{error}</div>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="username"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: "#007bff" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isLoading}>
              <FiLogIn />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </SubmitButton>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <BackLink to="/">
              <FiArrowLeft />
              Back to home
            </BackLink>
          </div>
        </LoginBody>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
