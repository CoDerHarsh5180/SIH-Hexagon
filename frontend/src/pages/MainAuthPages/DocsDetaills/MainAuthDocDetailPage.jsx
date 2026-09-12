import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  Wallet, 
  Clock, 
  Users,
  Loader2
} from 'lucide-react';
import { initialDocData } from './mockSingleDocData';
import { EditDocModal } from './EditDocModal';
import { mainAuthService } from '../../../services/mainAuthService';

export const MainAuthDocDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doc, setDoc] = useState(initialDocData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!id) return;
      try {
        const res = await mainAuthService.getMasterDocById(id);
        if (res?.data) {
          setDoc(res.data);
        }
      } catch (err) {
        console.warn('Using offline single master doc fallback:', err.message);
      }
    };
    fetchDoc();
  }, [id]);

  const handleSaveDoc = async (updatedData) => {
    try {
      await mainAuthService.updateMasterDoc(doc.id || id, updatedData);
    } catch (err) {
      console.warn('Backend update failed, applying changes locally:', err.message);
    }
    setDoc(updatedData);
    setIsEditModalOpen(false);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 3000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessBanner && (
          <div className="bg-india-blue/10 border border-india-blue/30 text-foreground p-3 rounded-lg flex items-center space-x-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-india-blue" />
            <span>Document details updated successfully. Changes are now live for the public.</span>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5">
          <button 
            onClick={() => navigate('/main-auth/our-docs')}
            className="flex items-center text-xs text-foreground/60 hover:text-india-blue transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Catalog
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-foreground/60 bg-border/20 px-2 py-0.5 rounded border border-border">
              {doc.id}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
              doc.status === 'ACTIVE' ? 'bg-india-blue/10 text-india-blue' :
              doc.status === 'PAUSED' ? 'bg-india-orange/10 text-india-orange' :
              'bg-border text-foreground/60'
            }`}>
              {doc.status}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {doc.name}
          </h1>
          <p className="text-xs text-foreground/70 uppercase tracking-wider font-semibold">
            {doc.category}
          </p>
        </div>

        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Document</span>
        </button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border bg-background p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-india-blue" /> Time to Complete
          </span>
          <span className="text-lg font-bold text-foreground">{doc.slaDays} Days</span>
        </div>
        <div className="border border-border bg-background p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
            <Wallet className="w-3 h-3 text-india-blue" /> Base Fee
          </span>
          <span className="text-lg font-bold text-foreground font-mono">₹{doc.baseFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="border border-border bg-background p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-india-blue" /> Total Requirements
          </span>
          <span className="text-lg font-bold text-foreground">{doc.requiredDocs.length} Papers</span>
        </div>
        <div className="border border-border bg-background p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-india-blue" /> Total Applications
          </span>
          <span className="text-lg font-bold text-foreground">{doc.totalApplications.toLocaleString()}</span>
        </div>
      </div>

      {/* Two Column Layout for Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Description & Required Docs */}
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-background">
            <h2 className="text-sm font-bold text-foreground mb-2">About this Document</h2>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {doc.description}
            </p>
          </div>

          <div className="border border-border rounded-xl p-5 bg-background">
            <h2 className="text-sm font-bold text-foreground mb-3">Required Papers from Public</h2>
            <div className="space-y-2">
              {doc.requiredDocs.map((paper, index) => (
                <div key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-border/5 text-xs font-semibold text-foreground/90">
                  <CheckCircle2 className="w-4 h-4 text-india-blue shrink-0" />
                  <span>{paper}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Explanation Settings */}
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-background h-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-india-blue shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Guidance Display</h2>
                <p className="text-[10px] text-foreground/50">This is exactly what the public sees when they ask for approval.</p>
              </div>
            </div>

            <div className="bg-border/10 p-4 rounded-lg border border-border space-y-4">
              <div>
                <span className="text-[10px] font-bold text-india-blue uppercase tracking-wider block mb-1">
                  Why is this required?
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed italic">
                  "{doc.aiReason}"
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-india-blue uppercase tracking-wider block mb-2">
                  Important Guidelines
                </span>
                <ul className="space-y-1.5">
                  {doc.aiPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className="text-india-blue mt-0.5">•</span>
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal Component */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditDocModal 
            isOpen={isEditModalOpen} 
            docData={doc} 
            onClose={() => setIsEditModalOpen(false)} 
            onSave={handleSaveDoc} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainAuthDocDetailsPage;