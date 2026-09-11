import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '../../layouts/AuthLayout/page';
import { districtsInState, authorityBodies, mockAuthApi } from './authMockData';
import { Building2, Landmark, Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

// --- REUSABLE UI COMPONENTS ---
const InputGroup = ({ label, icon: Icon, rightAction, required, ...props }) => (
  <div>
    <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-india-blue">*</span>}
    </label>
    <div className="relative">
      <input
        required={required}
        className={`w-full bg-background border border-border rounded-lg ${Icon ? 'pl-9' : 'p-2.5'} pr-3 py-2.5 text-foreground focus:outline-none focus:border-india-blue transition-colors`}
        {...props}
      />
      {Icon && <Icon className="w-4 h-4 text-foreground/40 absolute left-3 top-3" />}
      {rightAction && <div className="absolute right-3 top-3">{rightAction}</div>}
    </div>
  </div>
);

const SelectGroup = ({ label, options, required, ...props }) => (
  <div>
    <label className="block text-[11px] font-semibold text-foreground/70 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-india-blue">*</span>}
    </label>
    <select required={required} className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-india-blue" {...props}>
      {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  </div>
);

// --- MAIN PAGE ---
export const RegisterPage = ({ onNavigateToLogin }) => {
  const [role, setRole] = useState('USER');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Single State Object for all form fields
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', mobileNumber: '', otp: '',
    enterpriseName: '', enterpriseType: 'Food Factory', district: districtsInState[0],
    officerName: '', officerDesignation: '', authorityBody: authorityBodies[0], officerGovId: ''
  });

  const updateForm = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleInitiateRegistration = (e) => {
    e.preventDefault();
    if (formData.password.length < 8) return alert('Password must be at least 8 characters');
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');

    setIsSubmitting(true);
    setTimeout(() => {
      mockAuthApi.sendOtp(formData.email);
      setIsSubmitting(false);
      setStep(2);
    }, 600);
  };

  const handleVerifyOtpAndRegister = (e) => {
    e.preventDefault();
    if (formData.otp.length < 6) return alert('Please enter a valid 6-digit OTP');

    setIsSubmitting(true);
    setTimeout(() => {
      mockAuthApi.verifyOtpAndRegister({ ...formData, role });
      setIsSubmitting(false);
      alert('Account verified and registered successfully!');
      if (onNavigateToLogin) onNavigateToLogin();
    }, 800);
  };

  return (
    <AuthLayout title="Create an Account" subtitle="Register your enterprise or sign up as a local verification authority officer.">
      
      {/* Role Toggle */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-2 p-1 border border-border rounded-xl bg-background">
          {[
            { id: 'USER', label: 'Enterprise / User', icon: Building2 },
            { id: 'LOCAL_AUTH', label: 'Local Authority', icon: Landmark }
          ].map((r) => (
            <button
              key={r.id} type="button" onClick={() => setRole(r.id)}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === r.id ? 'bg-india-blue text-white shadow-xs' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <r.icon className="w-4 h-4" /> <span>{r.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: Details */}
      {step === 1 && (
        <form onSubmit={handleInitiateRegistration} className="space-y-3.5 text-xs">
          <AnimatePresence mode="wait">
            {role === 'USER' ? (
              <motion.div key="user" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
                <InputGroup label="Enterprise Legal Name" required placeholder="e.g. Sahyadri Agro Foods" value={formData.enterpriseName} onChange={updateForm('enterpriseName')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectGroup label="Business Sector" options={['Food Factory', 'Chemical & Pharma', 'Engineering & Auto', 'Cold Storage', 'Commercial']} value={formData.enterpriseType} onChange={updateForm('enterpriseType')} />
                  <SelectGroup label="Target District" options={districtsInState} value={formData.district} onChange={updateForm('district')} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="auth" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
                <InputGroup label="Officer Full Name" required placeholder="e.g. S. K. Kulkarni" value={formData.officerName} onChange={updateForm('officerName')} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectGroup label="Department Body" options={authorityBodies} value={formData.authorityBody} onChange={updateForm('authorityBody')} />
                  <SelectGroup label="Assigned District" options={districtsInState} value={formData.district} onChange={updateForm('district')} />
                  <InputGroup label="Official Designation" required placeholder="e.g. Scrutiny Officer" value={formData.officerDesignation} onChange={updateForm('officerDesignation')} />
                  <InputGroup label="Govt Employee ID" required placeholder="e.g. MH-GOV-8821" value={formData.officerGovId} onChange={updateForm('officerGovId')} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 pt-2 border-t border-border">
            <InputGroup label="Official Email Address" type="email" icon={Mail} required placeholder={role === 'USER' ? 'director@company.com' : 'officer@maharashtra.gov.in'} value={formData.email} onChange={updateForm('email')} />
            <InputGroup label="Mobile Number" type="tel" placeholder="+91 98000 00000" value={formData.mobileNumber} onChange={updateForm('mobileNumber')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
            <InputGroup label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} required placeholder="Min. 8 characters" value={formData.password} onChange={updateForm('password')} rightAction={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-foreground/40 hover:text-foreground cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }/>
            <InputGroup label="Confirm Password" type={showPassword ? 'text' : 'password'} icon={Lock} required placeholder="Re-enter password" value={formData.confirmPassword} onChange={updateForm('confirmPassword')} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 px-4 rounded-lg bg-india-blue text-white font-semibold text-xs hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 mt-2">
            <span>{isSubmitting ? 'Sending Code...' : 'Send Verification OTP'}</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <motion.form initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleVerifyOtpAndRegister} className="space-y-4 text-xs">
          <div className="border border-india-blue/30 bg-india-blue/5 rounded-lg p-3 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-india-blue shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold text-foreground block">Verification Code Sent</span>
              <span className="text-foreground/70 text-[11px]">Enter the 6-digit OTP sent to <strong className="text-foreground font-mono">{formData.email}</strong></span>
            </div>
          </div>

          <InputGroup label="Enter 6-Digit Email OTP" required maxLength={6} placeholder="123456" icon={KeyRound} value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })} className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-foreground font-mono text-center tracking-[0.4em] font-bold text-base focus:outline-none focus:border-india-blue" />

          <div className="flex items-center justify-between text-[11px] text-foreground/60">
            <span>Did not receive the code?</span>
            <button type="button" onClick={() => mockAuthApi.sendOtp(formData.email)} className="text-india-blue font-semibold hover:underline flex items-center space-x-1 cursor-pointer">
              <RotateCcw className="w-3 h-3" /> <span>Resend OTP</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 py-2.5 rounded-lg border border-border font-medium text-foreground hover:bg-border cursor-pointer">Edit Details</button>
            <button type="submit" disabled={isSubmitting} className="w-2/3 py-2.5 rounded-lg bg-india-blue text-white font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50">
              {isSubmitting ? 'Verifying...' : 'Verify OTP & Finish'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Switch to Login */}
      <div className="text-center pt-2 border-t border-border text-xs text-foreground/70">
        Already registered? <button type="button" onClick={onNavigateToLogin} className="text-india-blue font-semibold hover:underline cursor-pointer">Sign In</button>
      </div>
    </AuthLayout>
  );
};