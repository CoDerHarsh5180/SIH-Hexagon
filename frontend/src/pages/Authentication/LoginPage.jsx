import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/page';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

// Reusable Input Component (Shared with RegisterPage)
const InputGroup = ({ label, icon: Icon, rightAction, required, ...props }) => (
  <div>
    <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-india-blue">*</span>}
    </label>
    <div className="relative">
      <input
        required={required}
        className={`w-full bg-background border border-border rounded-lg ${Icon ? 'pl-9' : 'p-2.5'} ${rightAction ? 'pr-9' : 'pr-3'} py-2.5 text-foreground focus:outline-none focus:border-india-blue transition-colors`}
        {...props}
      />
      {Icon && <Icon className="w-4 h-4 text-foreground/40 absolute left-3 top-3" />}
      {rightAction && <div className="absolute right-3 top-3">{rightAction}</div>}
    </div>
  </div>
);

export const LoginPage = ({ onNavigateToRegister }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, devLoginAs } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, success: false, message: '', resetLink: '' });

  const updateForm = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleOpenForgotModal = () => {
    setForgotEmail(formData.email || '');
    setForgotStatus({ loading: false, success: false, message: '', resetLink: '' });
    setIsForgotModalOpen(true);
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      return setForgotStatus({ loading: false, success: false, message: 'Please enter your email address', resetLink: '' });
    }

    setForgotStatus({ loading: true, success: false, message: '', resetLink: '' });
    try {
      const res = await authService.forgotPassword(forgotEmail.trim());
      setForgotStatus({
        loading: false,
        success: true,
        message: res.message || 'Password reset link has been dispatched to your email.',
        resetLink: res.resetLink || '',
      });
    } catch (err) {
      setForgotStatus({
        loading: false,
        success: false,
        message: err.message || 'Failed to dispatch password reset email. Please try again.',
        resetLink: '',
      });
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.warning('Please provide both email and password');
    }

    setIsSubmitting(true);
    const emailLower = formData.email.toLowerCase();

    // Determine target portal hint
    let portalType = 'USER';
    if (emailLower.includes('local')) portalType = 'LOCAL_AUTH';
    else if (emailLower.includes('main') || emailLower.includes('admin') || emailLower.includes('mpcb')) portalType = 'MAIN_AUTH';

    try {
      const res = await login({ email: formData.email, password: formData.password, portalType });
      const userRole = res?.data?.user?.role || res?.user?.role || portalType;

      const fromPath = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state.from : null);

      if (userRole === 'LOCAL_AUTH') {
        navigate('/local-auth/requests');
      } else if (userRole === 'MAIN_AUTH') {
        navigate('/main-auth/dashboard');
      } else if (fromPath) {
        // Return back to where user clicked Apply Now or intended route
        navigate(fromPath, { state: location.state?.from?.state });
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('[LoginPage] Login failed:', err.message);
      toast.error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPortalAccess = (targetRole) => {
    devLoginAs(targetRole);
    if (targetRole === 'LOCAL_AUTH') {
      navigate('/local-auth/requests');
    } else if (targetRole === 'MAIN_AUTH') {
      navigate('/main-auth/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleGoToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate('/register');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your SARAL account to access your applications and clearances."
    >
      {location.state?.intent === 'APPLY_APPROVALS' && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 mb-2">
          <span className="text-base">📋</span>
          <div>
            <p className="font-bold">Authentication Required to Submit Clearances</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Please sign in to submit your selected clearances ({location.state?.itemCount || 'dockets'}). Your chosen parameters have been safely saved and will resume immediately after login.
            </p>
          </div>
        </div>
      )}

      {/* 1-Click Fast Preview Panel (Zero Backend Needed) */}
      <div className="p-3.5 rounded-xl border border-dashed border-india-orange/50 bg-india-orange/5 text-foreground space-y-2 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-india-orange uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span> One-Click Portal Preview (No Backend Required)
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Click any role below to instantly explore protected pages and dashboards:
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickPortalAccess('USER')}
            className="px-2 py-2 rounded-lg bg-card border border-border text-foreground hover:border-india-orange hover:text-india-orange text-[11px] font-bold transition-all text-center cursor-pointer shadow-2xs"
          >
            User Portal
          </button>
          <button
            type="button"
            onClick={() => handleQuickPortalAccess('LOCAL_AUTH')}
            className="px-2 py-2 rounded-lg bg-card border border-border text-foreground hover:border-india-blue hover:text-india-blue text-[11px] font-bold transition-all text-center cursor-pointer shadow-2xs"
          >
            Local Auth
          </button>
          <button
            type="button"
            onClick={() => handleQuickPortalAccess('MAIN_AUTH')}
            className="px-2 py-2 rounded-lg bg-card border border-border text-foreground hover:border-india-orange hover:text-india-orange text-[11px] font-bold transition-all text-center cursor-pointer shadow-2xs"
          >
            Main Auth
          </button>
        </div>
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-border"></div>
        <span className="shrink mx-2 text-[10px] uppercase font-semibold text-muted-foreground">or sign in with credentials</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
        <InputGroup 
          label="Email Address" 
          type="email" 
          icon={Mail} 
          required 
          placeholder="name@company.com or officer@maharashtra.gov.in" 
          value={formData.email} 
          onChange={updateForm('email')} 
        />

        {/* Custom wrapping for the Password field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">
              Password <span className="text-india-blue">*</span>
            </label>
            <button 
              type="button" 
              onClick={handleOpenForgotModal} 
              className="text-[11px] text-india-blue hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your account password"
              value={formData.password}
              onChange={updateForm('password')}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-9 py-2.5 text-foreground focus:outline-none focus:border-india-blue transition-colors"
            />
            <Lock className="w-4 h-4 text-foreground/40 absolute left-3 top-3" />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-foreground/40 hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-2.5 px-4 rounded-lg bg-india-orange text-white font-semibold text-xs hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 pt-2 shadow-xs transition-opacity"
        >
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span> 
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border text-xs text-muted-foreground mt-4">
        <div>
          Don&apos;t have an account yet?{' '}
          <button 
            type="button" 
            onClick={handleGoToRegister} 
            className="text-india-orange font-semibold hover:underline cursor-pointer"
          >
            Register here
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-foreground hover:text-india-orange transition-colors cursor-pointer"
        >
          &larr; Back to Landing Page
        </button>
      </div>

      {/* Forgot Password Interactive Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl relative text-foreground"
            >
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 mb-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>🔑</span> Reset Your Password
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter your registered official email. We will send you a secure link to reset your password.
                </p>
              </div>

              {forgotStatus.success ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <p className="font-semibold">Reset Link Dispatched!</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        A secure password reset link has been dispatched to <strong>{forgotEmail}</strong>. Please check your inbox (and spam folder). The link is valid for 1 hour.
                      </p>
                    </div>
                  </div>

                  {forgotStatus.resetLink && (
                    <div className="p-3 rounded-lg border border-india-blue/30 bg-india-blue/5 space-y-2">
                      <span className="text-[10px] font-bold text-india-blue uppercase tracking-wider block">
                        🚀 Direct Link (Development Mode)
                      </span>
                      <a
                        href={forgotStatus.resetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md bg-india-blue text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        <span>Open Reset Password Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full py-2.5 rounded-lg border border-border font-semibold text-xs hover:bg-border/50 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendResetEmail} className="space-y-4 text-xs">
                  {forgotStatus.message && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{forgotStatus.message}</span>
                    </div>
                  )}

                  <InputGroup
                    label="Registered Email Address"
                    type="email"
                    icon={Mail}
                    required
                    placeholder="Enter your registered account email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="w-1/3 py-2.5 rounded-lg border border-border font-medium text-foreground hover:bg-border/50 cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotStatus.loading}
                      className="w-2/3 py-2.5 rounded-lg bg-india-blue text-white font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50 text-center shadow-xs"
                    >
                      {forgotStatus.loading ? 'Sending Link...' : <span>Send Reset Link &rarr;</span>}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default LoginPage;