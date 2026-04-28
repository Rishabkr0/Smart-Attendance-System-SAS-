import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Camera, Users, ClipboardList, LayoutDashboard, LogOut, ShieldCheck, Settings, HelpCircle, Activity, FileText, Bug, Headphones } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/scanner', icon: Camera, label: 'Live Scanner' },
    { to: '/register-student', icon: Users, label: 'Students' },
    { to: '/records', icon: ClipboardList, label: 'Attendance' },
  ];

  return (
    <div className="min-h-screen flex bg-background h-screen overflow-hidden">
      {/* Sidebar - Sentinel Aesthetic */}
      <aside className="w-72 bg-surface-container-low hidden md:flex flex-col h-full">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <ShieldCheck size={24} />
            </div>
            <div>
               <h1 className="text-xl font-bold font-display leading-tight">Sentinel AI</h1>
               <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">Precision Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/50 mb-4 mt-6">Main System</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link 
                key={item.to}
                to={item.to} 
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <item.icon size={20} className={isActive ? '' : 'group-hover:text-primary transition-colors'} /> 
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}

          <p className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/50 mb-4 mt-12">Support</p>
          <Link to="/contact-support" className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${location.pathname === '/contact-support' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
             <Headphones size={20} className={location.pathname === '/contact-support' ? '' : 'group-hover:text-primary transition-colors'} /> 
             <span className="font-semibold text-sm">Contact Support</span>
          </Link>
          <Link to="/bug-report" className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${location.pathname === '/bug-report' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
             <Bug size={20} className={location.pathname === '/bug-report' ? '' : 'group-hover:text-red-500 transition-colors'} /> 
             <span className="font-semibold text-sm">Report a Bug</span>
          </Link>

          <p className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/50 mb-4 mt-12">Legal</p>
          <Link to="/privacy-policy" className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${location.pathname === '/privacy-policy' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
             <ShieldCheck size={20} className={location.pathname === '/privacy-policy' ? '' : 'group-hover:text-primary transition-colors'} /> 
             <span className="font-semibold text-sm">Privacy Policy</span>
          </Link>
          <Link to="/terms-of-service" className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${location.pathname === '/terms-of-service' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
             <FileText size={20} className={location.pathname === '/terms-of-service' ? '' : 'group-hover:text-primary transition-colors'} /> 
             <span className="font-semibold text-sm">Terms of Service</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-surface-container-lowest/50 rounded-3xl p-6 mb-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">System Online</span>
             </div>
             <p className="text-xs text-on-surface-variant/60 font-medium">Scanner Node: Gate 01-08 active and monitoring.</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={20} /> Logout Account
          </button>
        </div>
      </aside>
      
      {/* Main Stage */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-20 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 md:hidden sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-primary" />
              <span className="font-bold text-lg font-display tracking-tight">Sentinel AI</span>
            </div>
            <button onClick={handleLogout} className="text-red-500 p-2"><LogOut size={20} /></button>
        </header>
        
        <div className="p-8 lg:p-12 overflow-y-auto flex-1">
          <Outlet />
        </div>

        {/* Floating Intelligence HUD background hint */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-tertiary/5 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
      </main>
    </div>
  );
};

export default Layout;
