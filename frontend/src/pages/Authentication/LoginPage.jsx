import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout/page';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

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
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      return alert('Please provide both email and password');
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('[API MOCK] Logging in:', formData);
      setIsSubmitting(false);
      alert('Login successful! Redirecting to dashboard...');
    }, 700);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in securely to your DocFlow account using your email and password."
    >
      <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
        <InputGroup 
          label="Registered Email Address" 
          type="email" 
          icon={Mail} 
          required 
          placeholder="name@company.com or officer@maharashtra.gov.in" 
          value={formData.email} 
          onChange={updateForm('email')} 
        />

        {/* Custom wrapping for the Password field to fit the "Forgot Password" link */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">
              Password <span className="text-india-blue">*</span>
            </label>
            <button 
              type="button" 
              onClick={() => alert('Password reset link will be sent to your registered email.')} 
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
          className="w-full py-2.5 px-4 rounded-lg bg-india-blue text-white font-semibold text-xs hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 pt-2"
        >
          <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In'}</span> 
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center pt-4 border-t border-border text-xs text-foreground/70 mt-6">
        Don&apos;t have an account yet?{' '}
        <button 
          type="button" 
          onClick={onNavigateToRegister} 
          className="text-india-blue font-semibold hover:underline cursor-pointer"
        >
          Register here
        </button>
      </div>
    </AuthLayout>
  );
};