import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, User, Fingerprint, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const StudentLogin = () => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('studentInfo')) {
            navigate('/student-dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/student-login', { name, rollNumber });
            localStorage.setItem('studentInfo', JSON.stringify(data));
            navigate('/student-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Invalid Roll Number or Name.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background relative overflow-hidden font-body">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex-1 hidden lg:flex flex-col justify-center p-24 relative overflow-hidden">
                <div className="max-w-2xl space-y-8 animate-fade-in relative z-10">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="bg-primary/10 p-4 rounded-[32px] backdrop-blur-xl">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="text-4xl font-black font-display tracking-tightest">Student Portal</h2>
                    </div>
                    <h1 className="text-6xl font-black font-display tracking-tightest leading-[1.1] text-on-surface">
                        Welcome to your <span className="text-primary italic">Intelligence Dashboard</span>.
                    </h1>
                    <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-xl">
                        Log in using your official credentials to securely view your attendance analytics and bio-records.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-[600px] bg-white shadow-2xl flex flex-col justify-center p-8 md:p-16 relative z-10">
                <Link to="/login" className="absolute top-8 left-8 text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 text-sm font-bold">
                    <ArrowLeft size={16} /> Admin Portal
                </Link>

                <div className="max-w-md mx-auto w-full space-y-12 mt-8 lg:mt-0">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black font-display tracking-tight text-on-surface">Student Access</h2>
                        <p className="text-on-surface-variant font-medium">Identify yourself to bypass gate constraints.</p>
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
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">Full Identity Name</label>
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" required placeholder="John Doe"
                                        className="w-full bg-surface-container-low border-none rounded-2xl pl-16 pr-6 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-on-surface placeholder:opacity-30"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">System Hash / Roll Number</label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" required placeholder="e.g. CS2024-001"
                                        className="w-full bg-surface-container-low border-none rounded-2xl pl-16 pr-6 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-on-surface placeholder:opacity-30"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="btn-primary w-full justify-center !py-6 shadow-2xl shadow-primary/20 group uppercase tracking-widest text-sm"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    VERIFYING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                                    ACCESS DASHBOARD <ArrowRight size={20} />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="pt-8 text-center space-y-6">
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                            <p className="text-sm font-bold text-on-surface-variant mb-4">New identity requiring system access?</p>
                            <Link to="/self-enrollment" className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-white text-primary border border-primary/20 py-4 rounded-xl hover:bg-primary/5 transition-all shadow-sm">
                                Initiate Self-Enrollment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
