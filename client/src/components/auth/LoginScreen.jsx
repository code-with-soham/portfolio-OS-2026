import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { Bot, ShieldCheck } from 'lucide-react';
import axios from 'axios';

// Get Client ID from env or use a placeholder
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-placeholder.apps.googleusercontent.com';

const LoginScreen = () => {
  const login = useAuthStore((s) => s.login);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('/api/auth/google', {
        credential: credentialResponse.credential
      });
      
      login(res.data, res.data.token);
    } catch (error) {
      console.error('Login Failed', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Google Sign In was unsuccessful');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          width: '100%', 
          alignItems: 'center' 
        }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            theme="filled_black"
            shape="pill"
            text="continue_with"
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'var(--color-text-tertiary)' }}>
            <ShieldCheck size={14} />
            <span style={{ fontSize: '12px' }}>Secure authentication via Google OAuth 2.0</span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginScreen;
