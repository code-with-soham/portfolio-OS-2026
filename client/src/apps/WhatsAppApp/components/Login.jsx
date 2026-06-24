import React, { useState } from 'react';
import { useWhatsAppAuthStore } from '../../../store/useWhatsAppAuthStore';

export default function Login() {
  const [phone, setPhone] = useState('+911111111111');
  const [pin, setPin] = useState('1234');
  const { login, loading, error } = useWhatsAppAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(phone, pin);
  };

  return (
    <div className="wa-login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: 'var(--wa-bg-app)' }}>
      <div className="wa-login-box" style={{ background: 'var(--wa-panel-bg)', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--wa-text-primary)', marginBottom: '10px' }}>WhatsApp Web</h2>
        <p style={{ color: 'var(--wa-text-secondary)', marginBottom: '30px' }}>Login with your phone number</p>

        {error && <div style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Phone Number (+91...)" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--wa-border)', background: 'var(--wa-bg-app)', color: 'var(--wa-text-primary)' }}
            required
          />
          <input 
            type="password" 
            placeholder="PIN (1234)" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--wa-border)', background: 'var(--wa-bg-app)', color: 'var(--wa-text-primary)' }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', background: 'var(--wa-green)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
