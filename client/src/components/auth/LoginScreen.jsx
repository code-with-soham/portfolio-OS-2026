import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Bot, LogIn } from 'lucide-react';
import api from '../../services/api';

const LoginScreen = () => {
  const login = useAuthStore((s) => s.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { name, email });
      login(res.data, res.data.token);
    } catch (err) {
      console.error('Login Failed', err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: 'var(--color-bg-surface)',
      borderRadius: 'var(--radius-window)',
      boxShadow: 'var(--shadow-window)'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)',
        padding: '24px',
        borderRadius: '50%',
        marginBottom: '24px',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)'
      }}>
        <Bot size={48} color="var(--color-accent-light)" />
      </div>
      
      <h2 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '24px', 
        fontWeight: 600, 
        color: 'var(--color-text-primary)' 
      }}>
        Portfolio AI Agent
      </h2>
      
      <p style={{ 
        margin: '0 0 32px 0', 
        fontSize: '14px', 
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
        maxWidth: '80%'
      }}>
        Sign in to access personalized features, save your chat history, and interact with the OS.
      </p>

      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          width: '100%',
          maxWidth: '300px'
        }}
      >
        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '8px',
            background: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isLoading ? 0.7 : 1,
            transition: 'background 0.2s'
          }}
        >
          <LogIn size={18} />
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
