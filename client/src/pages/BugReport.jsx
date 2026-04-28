import React, { useState } from 'react';
import { Bug, AlertTriangle, Terminal, Send, ChevronLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BugReport = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

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
        <div className="bg-red-50 p-4 rounded-2xl text-red-600">
          <Bug size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Bug Report</h1>
          <p className="text-on-surface-variant font-medium">Identify anomalies in the system architecture.</p>
        </div>
      </div>

      <div className="sentinel-card border-l-4 border-red-500 mb-10 flex items-start gap-4 p-6">
        <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
        <div>
          <p className="font-bold text-on-surface">Vigilance Protocol</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Detailed reports help our engineers maintain system integrity. Please include steps to reproduce the anomaly and any error codes received.
          </p>
        </div>
      </div>

      <div className="sentinel-card p-8 md:p-12">
        {submitted ? (
          <div className="text-center py-12 space-y-4 animate-scale-up">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <Terminal size={40} />
            </div>
            <h2 className="text-2xl font-bold">Anomaly Logged</h2>
            <p className="text-on-surface-variant">Your report has been queued for engineering review. Thank you for helping us optimize Sentinel AI.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Severity Level</label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-red-500/10 transition-all font-bold text-on-surface appearance-none">
                    <option>Low - Minor UI Issue</option>
                    <option>Medium - Functional Glitch</option>
                    <option>High - System Component Failure</option>
                    <option>Critical - System Inaccessible</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">System Area</label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-red-500/10 transition-all font-bold text-on-surface appearance-none">
                    <option>Scanner Module</option>
                    <option>Student Directory</option>
                    <option>Attendance Records</option>
                    <option>Authentication</option>
                    <option>Dashboard Intelligence</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Anomaly Title</label>
                <input required type="text" className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-red-500/10 transition-all font-medium" placeholder="E.g., Scanner failing to register at night" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Steps to Reproduce</label>
                <textarea required rows="4" className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-red-500/10 transition-all font-medium resize-none" placeholder="1. Navigate to...&#10;2. Click on...&#10;3. Observe..."></textarea>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Evidence (Screenshots/Logs)</label>
                 <div className="border-2 border-dashed border-surface-container-high rounded-2xl p-12 text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <Upload className="mx-auto text-on-surface-variant/30 group-hover:text-primary transition-colors mb-4" size={32} />
                    <p className="font-bold text-on-surface-variant">Drop evidence files here or click to browse</p>
                    <p className="text-xs text-on-surface-variant/50 mt-1">Maximum file size: 10MB</p>
                 </div>
              </div>
            </div>

            <button type="submit" className="bg-red-600 text-white w-full justify-center py-5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-600/10 active:scale-[0.98]">
              <Send size={20} />
              Transmit Bug Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BugReport;
