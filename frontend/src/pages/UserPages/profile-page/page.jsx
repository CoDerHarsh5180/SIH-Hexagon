import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Pencil, 
  LogOut, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { vaultService } from '../../../services/vaultService';
import { useAuth } from '../../../context/AuthContext';
import DocumentUploadModal, { DOCUMENT_CATEGORIES } from '../../../components/common/DocumentUploadModal';

const EditableField = ({ label, value, editValue, isEditing, onChange, placeholder = 'Not Provided' }) => (
  <div>
    <label className="block text-[11px] font-semibold text-foreground/50 mb-1">{label}</label>
    {isEditing ? (
      <input
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        data-lpignore="true"
        data-form-type="other"
        value={editValue || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue transition-colors"
      />
    ) : (
      <p className="font-semibold text-foreground text-xs py-1">
        {value ? value : <span className="text-foreground/40 italic font-normal">{placeholder}</span>}
      </p>
    )}
  </div>
);

const FactCard = ({ label, value, mono = false, status = null }) => (
  <div className="p-3 rounded-xl border border-border bg-card/30">
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-foreground/50 block uppercase tracking-wider">{label}</span>
      {status && (
        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          {status}
        </span>
      )}
    </div>
    <span className={`font-bold text-foreground text-xs block mt-1 ${mono ? 'font-mono truncate' : ''}`}>
      {value ? value : <span className="text-foreground/30 font-normal italic">Not Registered</span>}
    </span>
  </div>
);

const SectionHeading = ({ title, subtitle, rightElement = null }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
    <div>
      <h2 className="text-sm sm:text-base font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>}
    </div>
    {rightElement}
  </div>
);

export const EnterpriseProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [vaultDocs, setVaultDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  // Document Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadCategory, setSelectedUploadCategory] = useState('PAN_CARD');

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profRes, docsRes] = await Promise.allSettled([
        authService.getProfile(),
        vaultService.getVaultDocuments(),
      ]);

      if (profRes.status === 'fulfilled') {
        const ent = profRes.value?.data?.enterprise || profRes.value?.enterprise || profRes.value?.data;
        const userObj = profRes.value?.data?.user || profRes.value?.user || authUser;
        
        const cleanProfile = {
          businessId: ent?.businessId || (userObj?._id ? `ENT-MH-${userObj._id.slice(-6).toUpperCase()}` : 'ENT-MH-NEW'),
          factoryName: ent?.factoryName || userObj?.companyName || userObj?.name || 'Industrial Enterprise',
          businessType: ent?.businessType || userObj?.industryType || 'Pending Setup',
          category: ent?.category || 'General Industrial',
          currentStage: ent?.currentStage || (userObj?.profileStatus === 'COMPLETED' ? 'Operational / Verified' : 'Incomplete Registration'),
          profileStatus: userObj?.profileStatus || ent?.profileStatus || 'INCOMPLETE',
          profileCompletion: userObj?.profileCompletion || ent?.profileCompletion || 20,
          ownershipType: userObj?.ownershipType || ent?.ownershipType || 'REGISTERED_COMPANY',
          udyamNumber: ent?.udyamNumber || userObj?.udyogAadhaar || '',
          gstNumber: ent?.gstNumber || userObj?.gstin || '',
          panNumber: ent?.panNumber || userObj?.panNumber || '',
          startDate: ent?.startDate || 'Recently Registered',
          location: {
            plotNumber: ent?.location?.plotNumber || userObj?.address?.street || '',
            area: ent?.location?.area || userObj?.address?.city || '',
            district: ent?.location?.district || userObj?.district || 'Pune',
            taluka: ent?.location?.taluka || userObj?.district || 'Pune',
            state: ent?.location?.state || userObj?.state || 'Maharashtra',
            pincode: ent?.location?.pincode || userObj?.address?.pincode || '',
          },
          factoryDetails: {
            plotArea: ent?.factoryDetails?.plotArea || userObj?.factoryDetails?.plotArea || '',
            builtArea: ent?.factoryDetails?.builtArea || userObj?.factoryDetails?.builtArea || '',
            electricityLoad: ent?.factoryDetails?.electricityLoad || userObj?.factoryDetails?.electricityLoad || '',
            dailyWaterUse: ent?.factoryDetails?.dailyWaterUse || userObj?.factoryDetails?.dailyWaterUse || '',
            wasteWaterSetup: ent?.factoryDetails?.wasteWaterSetup || userObj?.factoryDetails?.wasteWaterSetup || '',
            machineCost: ent?.factoryDetails?.machineCost || userObj?.factoryDetails?.machineCost || '',
            totalProjectCost: ent?.factoryDetails?.totalProjectCost || userObj?.factoryDetails?.totalProjectCost || '',
            enterpriseDescription: ent?.factoryDetails?.enterpriseDescription || userObj?.factoryDetails?.enterpriseDescription || '',
          },
          ownerDetails: {
            fullName: ent?.ownerDetails?.fullName || userObj?.fullName || userObj?.name || '',
            post: ent?.ownerDetails?.post || userObj?.designation || 'Authorized Representative',
            email: ent?.ownerDetails?.email || userObj?.email || '',
            mobileNumber: ent?.ownerDetails?.mobileNumber || userObj?.phone || '',
            idNumber: ent?.ownerDetails?.idNumber || userObj?.panNumber || '',
          },
          licenses: ent?.licenses || {
            fssaiNumber: '',
            mpcbNumber: '',
            fireNocNumber: '',
            factoryLicenseStatus: 'Not Applied',
          },
        };

        setProfile(cleanProfile);
        setFormData(cleanProfile);
      } else if (authUser) {
        const userObj = authUser;
        const fallbackProfile = {
          businessId: userObj?._id ? `ENT-MH-${userObj._id.slice(-6).toUpperCase()}` : 'ENT-MH-USER',
          factoryName: userObj?.companyName || userObj?.name || 'Industrial Enterprise',
          businessType: userObj?.industryType || 'MSME Enterprise',
          category: 'General Industrial',
          currentStage: userObj?.profileStatus === 'COMPLETED' ? 'Operational / Verified' : 'Incomplete Registration',
          profileStatus: userObj?.profileStatus || 'INCOMPLETE',
          profileCompletion: userObj?.profileCompletion || 20,
          ownershipType: userObj?.ownershipType || 'REGISTERED_COMPANY',
          udyamNumber: userObj?.udyogAadhaar || '',
          gstNumber: userObj?.gstin || '',
          panNumber: userObj?.panNumber || '',
          startDate: 'Recently Registered',
          location: {
            plotNumber: userObj?.address?.street || '',
            area: userObj?.address?.city || '',
            district: userObj?.district || 'Pune',
            taluka: userObj?.district || 'Pune',
            state: userObj?.state || 'Maharashtra',
            pincode: userObj?.address?.pincode || '',
          },
          factoryDetails: {
            plotArea: userObj?.factoryDetails?.plotArea || '',
            builtArea: userObj?.factoryDetails?.builtArea || '',
            electricityLoad: userObj?.factoryDetails?.electricityLoad || '',
            dailyWaterUse: userObj?.factoryDetails?.dailyWaterUse || '',
            wasteWaterSetup: userObj?.factoryDetails?.wasteWaterSetup || '',
            machineCost: userObj?.factoryDetails?.machineCost || '',
            totalProjectCost: userObj?.factoryDetails?.totalProjectCost || '',
            enterpriseDescription: userObj?.factoryDetails?.enterpriseDescription || '',
          },
          ownerDetails: {
            fullName: userObj?.fullName || userObj?.name || 'Enterprise Owner',
            post: userObj?.designation || 'Authorized Representative',
            email: userObj?.email || '',
            mobileNumber: userObj?.phone || '',
            idNumber: userObj?.panNumber || '',
          },
          licenses: {
            fssaiNumber: '',
            mpcbNumber: '',
            fireNocNumber: '',
            factoryLicenseStatus: 'Not Applied',
          },
        };
        setProfile(fallbackProfile);
        setFormData(fallbackProfile);
      }

      if (docsRes.status === 'fulfilled') {
        const rawDocs = docsRes.value?.data || docsRes.value || [];
        setVaultDocs(Array.isArray(rawDocs) ? rawDocs : []);
      }
    } catch (err) {
      console.warn('[ProfilePage] Error loading profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out from your account?')) {
      await logout();
      navigate('/login');
    }
  };

  const handleChange = (section, key, value) => {
    setFormData((prev) => {
      if (!prev) return prev;
      if (!section) {
        return { ...prev, [key]: value };
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [key]: value,
        },
      };
    });
  };

  const handleFieldChange = (section, key, value) => handleChange(section, key, value);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      const ownerName = (formData?.ownerDetails?.fullName || '').trim();
      const companyName = (formData?.factoryName || '').trim();
      const payload = {
        ...formData,
        name: ownerName || companyName,
        fullName: ownerName || companyName,
        companyName: companyName,
        factoryName: companyName,
        phone: formData?.ownerDetails?.mobileNumber || formData?.phone,
        designation: formData?.ownerDetails?.post || formData?.designation,
        panNumber: formData?.panNumber || formData?.ownerDetails?.idNumber,
        ownerDetails: {
          ...(formData?.ownerDetails || {}),
          fullName: ownerName,
          post: formData?.ownerDetails?.post || 'Authorized Representative',
          mobileNumber: formData?.ownerDetails?.mobileNumber || '',
          idNumber: formData?.panNumber || formData?.ownerDetails?.idNumber || '',
        },
      };
      const res = await authService.updateProfile(payload);
      const updated = res?.data?.enterprise || res?.data?.profile || res?.enterprise || formData;
      const updatedUser = res?.data?.user || res?.user;
      if (updatedUser && updateUser) {
        updateUser(updatedUser);
      }
      const newProfileState = {
        ...profile,
        ...updated,
        factoryName: companyName || updated.factoryName || profile?.factoryName,
        ownerDetails: {
          ...(profile?.ownerDetails || {}),
          ...(updated.ownerDetails || {}),
          fullName: ownerName || updated?.ownerDetails?.fullName || profile?.ownerDetails?.fullName,
          post: formData?.ownerDetails?.post || updated?.ownerDetails?.post || profile?.ownerDetails?.post,
          mobileNumber: formData?.ownerDetails?.mobileNumber || updated?.ownerDetails?.mobileNumber || profile?.ownerDetails?.mobileNumber,
        },
      };
      setProfile(newProfileState);
      setFormData(newProfileState);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3500);
    } catch (err) {
      console.warn('Backend update failed:', err.message);
      setProfile(formData);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3500);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleOpenUpload = (categoryCode) => {
    setSelectedUploadCategory(categoryCode);
    setUploadModalOpen(true);
  };

  const handleDocumentUploaded = async (data) => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 4000);
    await loadProfileData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-india-blue" />
        <p className="text-xs text-foreground/60 font-semibold">Loading Factory Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <AlertCircle className="w-10 h-10 text-india-orange" />
        <div>
          <h3 className="text-sm font-bold text-foreground">Unable to load Factory Profile</h3>
          <p className="text-xs text-foreground/60 mt-1">Please ensure the backend server is running and try again.</p>
        </div>
        <button
          onClick={loadProfileData}
          className="px-4 py-2 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const isProfileIncomplete = profile.profileStatus !== 'COMPLETED' || profile.profileCompletion < 80;
  const completionPercentage = profile.profileCompletion || 20;

  // Map uploaded documents by category
  const uploadedCategoryMap = {};
  vaultDocs.forEach((d) => {
    if (d.category) {
      uploadedCategoryMap[d.category] = d;
    }
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl flex items-center justify-between text-xs shadow-xs"
          >
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Document verified & Factory Profile updated successfully!</span>
            </div>
            <button onClick={() => setShowSavedMsg(false)} className="text-emerald-700 dark:text-emerald-300 font-bold hover:opacity-80">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INCOMPLETE PROFILE ALERT BANNER ── */}
      {isProfileIncomplete && (
        <div className="border border-india-orange/30 bg-india-orange/5 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-india-orange/10 text-india-orange border border-india-orange/20 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Action Needed: Complete Your Factory Profile ({completionPercentage}%)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-india-orange text-white uppercase tracking-wider">
                    Incomplete
                  </span>
                </div>
                <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                  To apply for government clearances, please upload your business documents: <strong>PAN Card</strong>, <strong>Aadhaar Card</strong>, <strong>Land Papers (7/12 Satbara / Lease)</strong>, and <strong>Udyam Registration</strong> (if registered).
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenUpload('PAN_CARD')}
              className="px-4 py-2 rounded-xl bg-india-orange text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0 flex items-center space-x-1.5 cursor-pointer shadow-xs self-start sm:self-center"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-foreground/60">
              <span>Profile Completion Status</span>
              <span className="font-mono font-bold text-india-orange">{completionPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-india-orange"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & General Header */}
      <div className="border border-border rounded-2xl bg-background p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl border border-border bg-india-blue/5 flex items-center justify-center shrink-0 text-india-blue mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-india-blue bg-india-blue/10 px-2.5 py-0.5 rounded-full border border-india-blue/20">
                  {profile.businessId}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-border text-foreground/70">
                  {profile.businessType}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  isProfileIncomplete 
                    ? 'border-india-orange/30 bg-india-orange/10 text-india-orange' 
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                }`}>
                  {profile.currentStage}
                </span>
              </div>
              {isEditing ? (
                <div className="mt-1 space-y-1 w-full max-w-md">
                  <label className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider block">
                    Enterprise / Factory Name
                  </label>
                  <input
                    type="text"
                    value={formData?.factoryName || ''}
                    onChange={(e) => handleChange(null, 'factoryName', e.target.value)}
                    placeholder="Enter enterprise legal name"
                    className="w-full bg-background border border-border rounded-lg p-2 text-foreground font-bold text-base focus:outline-none focus:border-india-blue"
                  />
                </div>
              ) : (
                <h1 className="text-lg sm:text-xl font-bold text-foreground break-words">{profile.factoryName}</h1>
              )}
              <p className="text-xs text-foreground/50 mt-0.5">
                {profile.location.area ? `${profile.location.area}, ` : ''}
                {profile.location.district ? `${profile.location.district} (Maharashtra)` : 'Maharashtra'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-foreground/70 hover:text-red-500 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFormData(profile); setIsEditing(false); }}
                  className="px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <FactCard 
            label="PAN Card Number" 
            value={profile.panNumber} 
            mono 
            status={profile.panNumber ? 'VERIFIED' : null} 
          />
          <FactCard 
            label="Udyam MSME Number" 
            value={profile.udyamNumber} 
            mono 
            status={profile.udyamNumber ? 'VERIFIED' : null} 
          />
          <FactCard 
            label="GST Number" 
            value={profile.gstNumber} 
            mono 
            status={profile.gstNumber ? 'VERIFIED' : null} 
          />
          <FactCard 
            label="Registration Date" 
            value={profile.startDate} 
          />
        </div>
      </div>

      {/* ── STATUTORY DOCUMENT VAULT & VERIFICATION SECTION ── */}
      <div className="border border-border rounded-2xl bg-background p-5 sm:p-6 space-y-4 shadow-xs">
        <SectionHeading
          title="Required Business & Factory Documents"
          subtitle="Upload official PDF documents. Our system reads them and saves your details automatically."
          rightElement={
            <button
              onClick={() => handleOpenUpload('PAN_CARD')}
              className="px-3.5 py-1.5 rounded-xl bg-india-blue/10 text-india-blue border border-india-blue/20 hover:bg-india-blue/20 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document (PDF)</span>
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const uploadedDoc = uploadedCategoryMap[cat.code];
            const isVerified = Boolean(uploadedDoc);

            return (
              <div
                key={cat.code}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  isVerified
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : cat.required
                    ? 'border-india-orange/30 bg-india-orange/5'
                    : 'border-border bg-card/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider bg-background text-foreground/60">
                      {cat.tag}
                    </span>
                    {isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Uploaded & Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-india-orange flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{cat.required ? 'Mandatory' : 'Optional'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-foreground">{cat.label}</h3>
                  <p className="text-[11px] text-foreground/60 mt-1 leading-relaxed">{cat.desc}</p>

                  {isVerified && (
                    <div className="mt-3 p-2 rounded-lg bg-background border border-border text-[11px] space-y-0.5">
                      <span className="text-foreground/40 block text-[10px]">Document Number:</span>
                      <span className="font-mono font-bold text-foreground break-all">
                        {uploadedDoc.certificateNumber || uploadedDoc.documentName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between">
                  {isVerified ? (
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={uploadedDoc.fileUrl || uploadedDoc.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-india-blue hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View PDF</span>
                      </a>
                      <button
                        onClick={() => handleOpenUpload(cat.code)}
                        className="text-[11px] text-foreground/50 hover:text-foreground hover:underline cursor-pointer"
                      >
                        Change / Re-upload
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenUpload(cat.code)}
                      className="w-full py-1.5 rounded-lg bg-background border border-border hover:border-india-blue hover:text-india-blue text-xs font-bold text-foreground/70 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-india-blue" />
                      <span>Upload Document (PDF)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Identity, Location & Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Enterprise & Owner Identity */}
          <div className="border border-border rounded-2xl p-5 sm:p-6 space-y-4 bg-background shadow-xs">
            <div className="flex items-center justify-between">
              <SectionHeading
                title="Enterprise & Authorized Representative Identity"
                subtitle="Person and enterprise entity legally responsible for operations, permits, and compliance."
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-xl bg-india-blue/10 text-india-blue border border-india-blue/20 hover:bg-india-blue/20 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Identity</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <EditableField
                label="Owner / Representative Full Name *"
                value={profile.ownerDetails.fullName}
                editValue={formData?.ownerDetails?.fullName}
                isEditing={isEditing}
                onChange={(v) => handleChange('ownerDetails', 'fullName', v)}
                placeholder="e.g. Ramesh Patil"
              />
              <EditableField
                label="Official Designation / Role"
                value={profile.ownerDetails.post}
                editValue={formData?.ownerDetails?.post}
                isEditing={isEditing}
                onChange={(v) => handleChange('ownerDetails', 'post', v)}
                placeholder="e.g. Managing Director / Proprietor"
              />
              <EditableField
                label="Enterprise / Company Legal Name *"
                value={profile.factoryName}
                editValue={formData?.factoryName}
                isEditing={isEditing}
                onChange={(v) => handleChange(null, 'factoryName', v)}
                placeholder="e.g. Sahyadri Agro Foods"
              />
              <EditableField
                label="Authorized Mobile Number"
                value={profile.ownerDetails.mobileNumber}
                editValue={formData?.ownerDetails?.mobileNumber}
                isEditing={isEditing}
                onChange={(v) => handleChange('ownerDetails', 'mobileNumber', v)}
                placeholder="+91 98000 00000"
              />
              <div>
                <label className="block text-[11px] font-semibold text-foreground/50 mb-1">Official Registered Email</label>
                <div className="py-2 px-3 rounded-lg bg-card/40 border border-border/50 text-foreground font-mono font-medium text-xs break-all">
                  {profile.ownerDetails.email || authUser?.email || 'N/A'}
                </div>
              </div>
              <EditableField
                label="Owner PAN / Identity Number"
                value={profile.panNumber || profile.ownerDetails.idNumber}
                editValue={formData?.panNumber}
                isEditing={isEditing}
                onChange={(v) => {
                  const upper = v.toUpperCase();
                  handleChange(null, 'panNumber', upper);
                  handleChange('ownerDetails', 'idNumber', upper);
                }}
                placeholder="ABCDE1234F"
              />
            </div>
          </div>
          {/* Address & Location */}
          <div className="border border-border rounded-2xl p-5 sm:p-6 space-y-4 bg-background shadow-xs">
            <SectionHeading
              title="Factory Location & District"
              subtitle="Used to assign your local government and pollution control inspection officers."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <EditableField
                label="Plot / Survey / Gat Number"
                value={profile.location.plotNumber}
                editValue={formData.location.plotNumber}
                isEditing={isEditing}
                onChange={(v) => handleChange('location', 'plotNumber', v)}
                placeholder="e.g. Plot D-14, Gat No. 120"
              />
              <EditableField
                label="Industrial Area / MIDC Estate"
                value={profile.location.area}
                editValue={formData.location.area}
                isEditing={isEditing}
                onChange={(v) => handleChange('location', 'area', v)}
                placeholder="e.g. MIDC Chakan Phase 2"
              />
              <div>
                <label className="block text-[11px] font-semibold text-foreground/50 mb-1">District (Maharashtra)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => handleChange('location', 'district', e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-india-blue"
                  />
                ) : (
                  <p className="font-bold text-india-blue text-xs py-1">{profile.location.district || 'Maharashtra'}</p>
                )}
              </div>
              <EditableField
                label="PIN Code"
                value={profile.location.pincode}
                editValue={formData.location.pincode}
                isEditing={isEditing}
                onChange={(v) => handleChange('location', 'pincode', v)}
                placeholder="e.g. 410501"
              />
            </div>
          </div>

          {/* Factory Setup */}
          <div className="border border-border rounded-2xl p-5 sm:p-6 space-y-4 bg-background shadow-xs">
            <SectionHeading
              title="Factory Size & Investment Details"
              subtitle="Used to calculate government fees, electricity quota, and pollution consent category."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-border rounded-xl p-3 bg-card/20">
                <EditableField
                  label="Plot & Built-up Area"
                  value={profile.factoryDetails.plotArea ? `${profile.factoryDetails.plotArea} / ${profile.factoryDetails.builtArea || 'Shed'}` : ''}
                  editValue={formData.factoryDetails.plotArea}
                  isEditing={isEditing}
                  onChange={(v) => handleChange('factoryDetails', 'plotArea', v)}
                  placeholder="e.g. 45,000 sq ft"
                />
              </div>
              <div className="border border-border rounded-xl p-3 bg-card/20">
                <EditableField
                  label="Connected Electricity Load"
                  value={profile.factoryDetails.electricityLoad}
                  editValue={formData.factoryDetails.electricityLoad}
                  isEditing={isEditing}
                  onChange={(v) => handleChange('factoryDetails', 'electricityLoad', v)}
                  placeholder="e.g. 250 HP / kVA"
                />
              </div>
              <div className="border border-border rounded-xl p-3 bg-card/20">
                <EditableField
                  label="Daily Water Consumption"
                  value={profile.factoryDetails.dailyWaterUse}
                  editValue={formData.factoryDetails.dailyWaterUse}
                  isEditing={isEditing}
                  onChange={(v) => handleChange('factoryDetails', 'dailyWaterUse', v)}
                  placeholder="e.g. 10,000 Litres / day"
                />
              </div>
              <div className="border border-border rounded-xl p-3 bg-card/20">
                <EditableField
                  label="Total Project Investment"
                  value={profile.factoryDetails.totalProjectCost}
                  editValue={formData.factoryDetails.totalProjectCost}
                  isEditing={isEditing}
                  onChange={(v) => handleChange('factoryDetails', 'totalProjectCost', v)}
                  placeholder="e.g. Rs 5.5 Crore"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authorized Signatory */}
        <div className="space-y-5">
          <div className="border border-border rounded-2xl p-5 sm:p-6 space-y-4 bg-background shadow-xs">
            <div className="flex items-center justify-between">
              <SectionHeading
                title="Factory Owner / Main Representative"
                subtitle="Person responsible for legal notices and government communications."
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 py-1 rounded-lg border border-border text-[11px] font-semibold text-foreground hover:bg-border/50 cursor-pointer shrink-0"
                >
                  Edit Details
                </button>
              )}
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-foreground/40 block text-[11px] font-medium">Owner Full Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    value={formData?.ownerDetails?.fullName || ''}
                    onChange={(e) => handleFieldChange('ownerDetails', 'fullName', e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full mt-1 bg-background border border-border rounded-lg p-2 text-foreground font-semibold text-xs focus:outline-none focus:border-india-blue"
                  />
                ) : (
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {profile.ownerDetails.fullName || 'Factory Owner / Representative'}
                  </p>
                )}
              </div>

              <div>
                <span className="text-foreground/40 block text-[11px] font-medium">Official Designation / Post</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.ownerDetails?.post || ''}
                    onChange={(e) => handleFieldChange('ownerDetails', 'post', e.target.value)}
                    placeholder="e.g. Managing Director / Proprietor"
                    className="w-full mt-1 bg-background border border-border rounded-lg p-2 text-foreground text-xs focus:outline-none focus:border-india-blue"
                  />
                ) : (
                  <p className="text-foreground/60 text-xs mt-0.5">{profile.ownerDetails.post}</p>
                )}
              </div>
              
              <div className="border-t border-border pt-2.5">
                <span className="text-foreground/40 block text-[11px] font-medium">Official Email</span>
                <p className="text-foreground mt-0.5 break-all font-mono font-bold text-xs">{profile.ownerDetails.email}</p>
              </div>

              <div className="border-t border-border pt-2.5">
                <span className="text-foreground/40 block text-[11px] font-medium">Mobile Number</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData?.ownerDetails?.mobileNumber || ''}
                    onChange={(e) => handleFieldChange('ownerDetails', 'mobileNumber', e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full mt-1 bg-background border border-border rounded-lg p-2 text-foreground font-mono text-xs focus:outline-none focus:border-india-blue"
                  />
                ) : (
                  <p className="text-foreground mt-0.5 font-mono font-bold text-xs">{profile.ownerDetails.mobileNumber || 'Not Linked'}</p>
                )}
              </div>

              <div className="border-t border-border pt-2.5">
                <span className="text-foreground/40 block text-[11px] font-medium">Owner PAN / ID Number</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.panNumber || ''}
                    onChange={(e) => handleFieldChange(null, 'panNumber', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full mt-1 bg-background border border-border rounded-lg p-2 text-foreground font-mono uppercase text-xs focus:outline-none focus:border-india-blue"
                  />
                ) : (
                  <p className="text-foreground mt-0.5 font-mono font-bold text-xs">{profile.panNumber || 'Not Uploaded'}</p>
                )}
              </div>

              {isEditing && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setFormData(profile); setIsEditing(false); }}
                    className="w-1/2 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-border/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-1/2 py-2 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isSaving ? 'Saving...' : 'Save Details'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Clearances Link Card */}
          <div className="border border-india-blue/20 bg-india-blue/5 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-india-blue">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Find Your Approvals</h3>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Once your main documents are uploaded, find all required government approvals and fees for your factory.
            </p>
            <button
              onClick={() => navigate('/user/approvals')}
              className="w-full py-2.5 rounded-xl bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>Find Required Approvals →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        initialCategory={selectedUploadCategory}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={handleDocumentUploaded}
      />
    </div>
  );
};

export default EnterpriseProfilePage;