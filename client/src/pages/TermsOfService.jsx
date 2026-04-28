import React from 'react';
import { FileText, Scale, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm">Back to System</span>
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 p-4 rounded-2xl text-primary">
          <Scale size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-on-surface-variant font-medium">Effective Date: April 28, 2026</p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-xl font-bold">1. Agreement to Terms</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            By accessing or using the Sentinel AI Smart Attendance System, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold">2. Use License</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Permission is granted to use the system for institutional attendance tracking purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-surface-variant ml-4">
            <li>Attempt to decompile or reverse engineer any software contained in the system</li>
            <li>Use the system for any unauthorized surveillance</li>
            <li>Bypass or attempt to bypass any security features</li>
            <li>Transfer the license to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-xl font-bold">3. Disclaimer</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            The materials on Sentinel AI's system are provided on an 'as is' basis. Sentinel AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="sentinel-card">
          <h2 className="text-xl font-bold mb-4">4. Limitations</h2>
          <p className="text-on-surface-variant leading-relaxed">
            In no event shall Sentinel AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Smart Attendance System.
          </p>
        </section>

        <section className="sentinel-card">
          <h2 className="text-xl font-bold mb-4">5. Governing Law</h2>
          <p className="text-on-surface-variant leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the service provider operates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        <div className="sentinel-surface p-8 border-l-4 border-primary">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Important Note</p>
          <p className="text-on-surface-variant">
            These terms are subject to change at any time. Your continued use of the system following any changes constitutes your acceptance of the new Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
