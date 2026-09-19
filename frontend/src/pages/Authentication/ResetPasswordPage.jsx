import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout/page';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage = () => {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const resetToken = routeToken || searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation rules
  const validations = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasNumberOrSpecial: /[\d\W]/.test(password),
      passwordsMatch: password.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  const isFormValid = validations.minLength && validations.passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetToken) {
      setErrorMessage('Reset token is missing from the link. Please open the exact link from your email.');
      return;
    }

    if (!validations.minLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.resetPassword({
        token: resetToken,
        newPassword: password,
        confirmPassword,
      });

      setIsSuccess(true);

      // If token was returned, update auth context session
      const userRole = res?.user?.role || 'USER';
      setTimeout(() => {
        if (userRole === 'LOCAL_AUTH') {
          navigate('/local-auth/requests');
        } else if (userRole === 'MAIN_AUTH') {
          navigate('/main-auth/dashboard');
        } else {
          navigate('/login');
        }
      }, 3000);
    } catch (err) {
      console.error('[ResetPasswordPage] Error:', err);
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a strong, secure password to access your SARAL services and clearances."
    >
      {/* Success State */}
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 py-4 text-center"
        >
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Password Reset Successful!</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your account password has been updated securely. You are now being redirected to the sign-in portal.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      ) : !resetToken ? (
        /* Missing Token State */
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 py-4 text-center"
        >
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Missing Password Reset Link</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No reset token was found in the URL. Please ensure you clicked the full link sent to your email inbox.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-india-blue text-white text-xs font-semibold hover:opacity-90"
            >
              <span>Return to Sign In & Request Link</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
              New Password <span className="text-india-blue">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
              Confirm New Password <span className="text-india-blue">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-9 py-2.5 text-foreground focus:outline-none focus:border-india-blue transition-colors"
              />
              <Lock className="w-4 h-4 text-foreground/40 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password Strength Checklist */}
          <div className="p-3 rounded-lg border border-border bg-border/5 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${validations.minLength ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {validations.minLength ? '✓' : '•'}
              </span>
              <span className={validations.minLength ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${validations.hasNumberOrSpecial ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {validations.hasNumberOrSpecial ? '✓' : '•'}
              </span>
              <span className={validations.hasNumberOrSpecial ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Includes a number or symbol (recommended)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${validations.passwordsMatch ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {validations.passwordsMatch ? '✓' : '•'}
              </span>
              <span className={validations.passwordsMatch ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Passwords match
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-india-blue text-white font-semibold text-xs hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40 transition-opacity shadow-xs"
          >
            <span>{isSubmitting ? 'Updating Password...' : 'Save New Password & Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
