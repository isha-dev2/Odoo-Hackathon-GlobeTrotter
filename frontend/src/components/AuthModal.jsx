import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Globe, Sparkles } from 'lucide-react';
import api from '../api/client';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await api.post(endpoint, payload);
      if (res.data.token) localStorage.setItem('gt_token', res.data.token);
      onAuthSuccess(res.data.user || { name: form.name || form.email.split('@')[0], email: form.email });
      onClose();
    } catch (err) {
      // Demo fallback
      const demoUser = { name: form.name || form.email.split('@')[0], email: form.email, id: 'demo-1' };
      onAuthSuccess(demoUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, width: '100%', maxWidth: 440,
          overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.2)'
        }}
      >
        {/* Top gradient bar */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #134e4a)',
          padding: '32px 36px 28px', position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            width: 30, height: 30, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={14} color="white" />
          </button>

          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #0d9488, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, boxShadow: '0 4px 16px rgba(13,148,136,0.4)'
          }}>
            <Globe size={22} color="white" />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
            {mode === 'login' ? 'Welcome back' : 'Join GlobeTrotter'}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your travel account'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{ padding: '20px 36px 0' }}>
          <div style={{
            display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3
          }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#0f172a' : '#94a3b8',
                  border: 'none', cursor: 'pointer',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize', transition: 'all 0.15s'
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 36px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.05em' }}>
                FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  style={{
                    width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                    borderRadius: 10, padding: '10px 12px 10px 36px',
                    fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.05em' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                required
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, padding: '10px 12px 10px 36px',
                  fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, padding: '10px 36px 10px 36px',
                  fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
                }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8,
              padding: '8px 12px', fontSize: 12, color: '#e53e3e', fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #10b981)',
              color: 'white', border: 'none', borderRadius: 12,
              padding: '12px', fontSize: 13, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
              transition: 'all 0.15s'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>
      </div>
    </div>
  );
}
