import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, ShieldCheck, CheckCircle, XCircle, Clock, CalendarDays, LayoutDashboard, Fingerprint } from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [attendanceRows, setAttendanceRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        const info = JSON.parse(localStorage.getItem('studentInfo'));
        if (!info) {
            navigate('/student-login');
        } else {
            setStudentInfo(info);
            fetchAttendance(info._id);
        }
    }, [navigate]);

    const fetchAttendance = async (studentId) => {
        try {
            const { data } = await api.get(`/attendance/student/${studentId}`);
            setAttendanceRows(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('studentInfo');
        navigate('/student-login');
    };

    if (!studentInfo) return null;

    return (
        <div className="min-h-screen bg-background font-body text-on-surface">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-surface-container-high sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display tracking-tight leading-tight">Sentinel AI</h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">Student Portal</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                        <LogOut size={16} /> Disconnect Node
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
                <section className="bg-surface-container-low rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 border-4 border-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10 space-y-2">
                        <p className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Fingerprint size={16} /> Identity Verified
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black font-display">Welcome, {studentInfo.name}</h2>
                        <p className="text-lg text-on-surface-variant font-medium">Here acts as your personal intelligence overview.</p>
                    </div>
                    
                    <div className="relative z-10 flex gap-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 text-center px-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Hash ID</p>
                            <p className="text-2xl font-black font-display text-primary">{studentInfo.rollNumber}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 text-center px-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Course Domain</p>
                            <p className="text-lg font-bold font-display text-gray-800 mt-1">{studentInfo.course}</p>
                        </div>
                    </div>
                </section>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 ml-2 text-on-surface">
                         <LayoutDashboard className="text-primary" size={24} />
                         <h3 className="text-2xl font-bold font-display">Attendance History</h3>
                    </div>

                    <div className="bg-white border-4 border-surface-container-high rounded-[32px] p-2">
                        {loading ? (
                            <div className="py-24 flex justify-center w-full">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : attendanceRows.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="text-on-surface-variant/50 font-bold uppercase tracking-widest text-sm">No records found for this identity.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-lowest">
                                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 rounded-tl-2xl">Vigilance Subject</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Date Logged</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Time Registered</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 rounded-tr-2xl text-right">Status Code</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container-low">
                                        {attendanceRows.map((record) => {
                                            const dateObj = new Date(record.timestamp);
                                            return (
                                                <tr key={record._id} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="p-5 font-bold">{record.subject?.name || 'Unknown'}</td>
                                                    <td className="p-5 font-medium text-on-surface-variant flex items-center gap-2">
                                                        <CalendarDays size={16} className="opacity-50" />
                                                        {dateObj.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="p-5 font-medium text-on-surface-variant">
                                                        <div className="flex items-center gap-2">
                                                           <Clock size={16} className="opacity-50" />
                                                           {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest ${
                                                            record.status === 'Present' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {record.status === 'Present' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                            {record.status}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-surface-container-high flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 opacity-50">
                    <ShieldCheck size={20} />
                    <span className="font-bold text-sm tracking-tight">Sentinel AI © 2026</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <button onClick={() => navigate('/contact-support')} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Contact Support</button>
                    <button onClick={() => navigate('/bug-report')} className="text-sm font-bold text-on-surface-variant hover:text-red-500 transition-colors">Report Bug</button>
                    <button onClick={() => navigate('/privacy-policy')} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</button>
                    <button onClick={() => navigate('/terms-of-service')} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Terms of Service</button>
                </div>
            </footer>
        </div>
    );
};

export default StudentDashboard;
