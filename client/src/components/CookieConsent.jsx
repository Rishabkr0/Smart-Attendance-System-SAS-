import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Delayed show for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 z-[100] animate-fade-in pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-surface-container-lowest/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_40px_100px_-20px_rgba(13,30,37,0.15)] border border-white/40 overflow-hidden relative group">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-2xl text-primary animate-pulse-slow">
              <Cookie size={32} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <ShieldCheck size={16} className="text-primary" />
                <h3 className="text-lg font-bold tracking-tight">Privacy Preference</h3>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
                Sentinel AI uses cookies to enhance your experience, analyze system performance, and ensure secure authentication. By continuing, you agree to our <Link to="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button 
                onClick={handleDecline}
                className="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all w-full sm:w-auto"
              >
                Manage
              </button>
              <button 
                onClick={handleAccept}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Check size={18} />
                Accept All
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors hidden md:block"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
