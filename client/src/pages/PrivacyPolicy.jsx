import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-on-surface-variant font-medium">Last updated: April 28, 2026</p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <Lock size={20} />
            </div>
            <h2 className="text-xl font-bold">Introduction</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            At Sentinel AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Smart Attendance System.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
          </p>
        </section>

        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <Eye size={20} />
            </div>
            <h2 className="text-xl font-bold">Data Collection</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            We collect information that you provide directly to us when you register for an account, use the scanner, or contact us for support. This may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-surface-variant ml-4">
            <li>Name and contact information</li>
            <li>Student/Employee identification numbers</li>
            <li>Biometric data (facial patterns for attendance recognition)</li>
            <li>Attendance logs and timestamps</li>
            <li>Device information and IP addresses</li>
          </ul>
        </section>

        <section className="sentinel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-primary">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold">How We Use Your Data</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            The information we collect is used to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-surface-variant ml-4">
            <li>Provide and maintain the Smart Attendance System</li>
            <li>Automate attendance tracking and reporting</li>
            <li>Improve the accuracy of our AI recognition models</li>
            <li>Communicate with you about system updates</li>
            <li>Ensure the security and integrity of the system</li>
          </ul>
        </section>

        <section className="sentinel-card">
          <h2 className="text-xl font-bold mb-4">Data Security</h2>
          <p className="text-on-surface-variant leading-relaxed">
            We implement appropriate technical and organizational security measures to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>
        </section>

        <div className="bg-surface-container-low rounded-3xl p-8 text-center">
          <h3 className="text-lg font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-on-surface-variant mb-6">Our security team is here to help you understand how your data is protected.</p>
          <button className="btn-primary mx-auto">Contact Security Team</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
