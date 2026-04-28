import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Send, ChevronLeft, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactSupport = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
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
        <div className="bg-primary/10 p-4 rounded-2xl text-primary">
          <Headphones size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Contact Support</h1>
          <p className="text-on-surface-variant font-medium">How can our intelligence team assist you today?</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="sentinel-card text-center space-y-4">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-primary mx-auto">
            <Mail size={24} />
          </div>
          <div>
            <p className="font-bold">Email Us</p>
            <p className="text-sm text-on-surface-variant">support@sentinel.ai</p>
          </div>
        </div>
        <div className="sentinel-card text-center space-y-4">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-primary mx-auto">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="font-bold">Live Chat</p>
            <p className="text-sm text-on-surface-variant">Available 24/7</p>
          </div>
        </div>
        <div className="sentinel-card text-center space-y-4">
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-primary mx-auto">
            <Phone size={24} />
          </div>
          <div>
            <p className="font-bold">Call Support</p>
            <p className="text-sm text-on-surface-variant">+1 (555) 000-0000</p>
          </div>
        </div>
      </div>

      <div className="sentinel-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        {submitted ? (
          <div className="text-center py-12 space-y-4 animate-scale-up">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <Send size={40} />
            </div>
            <h2 className="text-2xl font-bold">Transmission Received</h2>
            <p className="text-on-surface-variant">Your support ticket has been logged in our system. An agent will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Full Name</label>
                <input required type="text" className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/10 transition-all font-medium" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Email Address</label>
                <input required type="email" className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/10 transition-all font-medium" placeholder="you@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Subject</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/10 transition-all font-medium appearance-none">
                <option>Account Access Issue</option>
                <option>Scanner Configuration</option>
                <option>Data Correction</option>
                <option>System Performance</option>
                <option>Other Enquiry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Message</label>
              <textarea required rows="5" className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/10 transition-all font-medium resize-none" placeholder="Describe your issue in detail..."></textarea>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-5 shadow-xl shadow-primary/20">
              Submit Support Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactSupport;
