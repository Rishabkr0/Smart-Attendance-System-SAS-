import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background relative overflow-hidden font-body">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] -z-10 rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/5 blur-[120px] -z-10 rounded-full -translate-x-1/4 translate-y-1/4"></div>

            <div className="flex-1 hidden lg:flex flex-col justify-center p-24 relative overflow-hidden">
                <div className="max-w-2xl space-y-8 animate-fade-in relative z-10">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="bg-primary/10 p-4 rounded-[32px] backdrop-blur-xl">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="text-4xl font-black font-display tracking-tightest">Sentinel AI</h2>
                    </div>
                    <h1 className="text-7xl font-black font-display tracking-tightest leading-[1.1] text-on-surface">
                        Precision <span className="text-primary italic">Intelligence</span> for the Modern Institution.
                    </h1>
                    <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-xl">
                        Vigilance protocols active. Our bio-recognition architecture ensures seamless identity verification and secure domain management.
                    </p>
                    
                    <div className="flex gap-12 pt-12 border-t border-on-surface/5">
                        <div className="space-y-1">
                            <p className="text-4xl font-black font-display text-primary">99.9%</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Logic Accuracy</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl font-black font-display text-primary">12ms</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Node Latency</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none">
                     <div className="grid grid-cols-10 gap-8">
                        {Array.from({length: 100}).map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-on-surface rounded-full"></div>
                        ))}
                     </div>
                </div>
            </div>

            <div className="w-full lg:w-[600px] bg-white shadow-2xl flex flex-col justify-center p-8 md:p-16 relative z-10">
                <div className="max-w-md mx-auto w-full space-y-12">
                    <div className="space-y-2">
                         <div className="lg:hidden flex items-center gap-3 text-primary mb-8">
                            <ShieldCheck size={32} />
                            <span className="font-black font-display text-2xl tracking-tight">Sentinel AI</span>
                        </div>
                        <h2 className="text-4xl font-black font-display tracking-tight text-on-surface">Welcome Back</h2>
                        <p className="text-on-surface-variant font-medium">Verify credentials to bypass security gate.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-4 animate-scale-up">
                            <AlertCircle className="text-red-600 mt-0.5" size={20} />
                            <p className="text-sm font-bold text-red-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">Admin Email Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="email" required placeholder="admin@sentinel.ai"
                                        className="w-full bg-surface-container-low border-none rounded-2xl pl-16 pr-6 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-on-surface placeholder:opacity-30"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">Secure Passkey</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="password" required placeholder="••••••••"
                                        className="w-full bg-surface-container-low border-none rounded-2xl pl-16 pr-6 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-on-surface placeholder:opacity-30"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-surface-container-high checked:bg-primary transition-all cursor-pointer" />
                                <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors italic">Trust this node</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-primary hover:underline underline-offset-4">Forgot Protocol?</a>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="btn-primary w-full justify-center !py-6 shadow-2xl shadow-primary/20 group uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    VERIFYING IDENTITY...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                                    AUTHENTICATE GATE ACCESS <ArrowRight size={20} />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 text-center space-y-6">
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                            <p className="text-sm font-bold text-on-surface-variant mb-4">Are you a student?</p>
                            <Link to="/student-login" className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-white text-primary border border-primary/20 py-4 rounded-xl hover:bg-primary/5 transition-all shadow-sm">
                                Access Student Portal <ArrowRight size={16} />
                            </Link>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40 italic">
                           Security Notice: Authorized Access Only. All activities are monitored by Vigilance AI protocols.
                        </p>
                    </div>
                </div>
                <div className="mt-auto pt-12 text-center flex flex-wrap justify-center gap-x-8 gap-y-2 opacity-40 hover:opacity-100 transition-opacity">
                    <Link to="/privacy-policy" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
                    <span className="text-[10px] font-black uppercase tracking-widest">© 2026 Sentinel AI</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
