import React from 'react';
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  FileCheck2 
} from 'lucide-react';

export const TrustSecuritySection = () => {
  return (
    <section className="py-16 bg-background border-b border-border transition-colors duration-300" id="security">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card text-card-foreground rounded-2xl border border-border p-8 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-india-blue/10 text-india-blue border border-india-blue/20 px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Government of Maharashtra Single Window</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                100% Genuine Digital Certificates with Instant QR Verification
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                No need to travel to government offices or wait in lines. Every clearance approved on SARAL carries an official digital certificate with a verifiable QR code recognized across all banks and state authorities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="border-l-2 border-india-orange pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Zero Physical Visits
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    100% online submission, review, and certificate download.
                  </p>
                </div>

                <div className="border-l-2 border-india-blue pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Full Transparency
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Know which officer has your file at every step of the way.
                  </p>
                </div>

                <div className="border-l-2 border-india-orange pl-3">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Secure Government Cloud
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hosted on state data centers with encrypted document storage.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Official Citizen Charter Card */}
            <div className="lg:col-span-4 bg-background p-6 rounded-xl border border-border shadow-xs flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-india-orange/10 text-india-orange border border-india-orange/20 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-foreground">
                Official Citizen Charter
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Maharashtra Right to Public Services Act
              </p>

              <div className="mt-5 w-full bg-muted/40 p-3.5 rounded-lg border border-border text-left">
                <span className="text-[11px] text-muted-foreground block">
                  State Single Window System:
                </span>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  Directorate of Industries, Maharashtra
                </p>
                <div className="text-[10px] text-india-blue font-mono font-bold mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>ONLINE &amp; OPERATIONAL 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
