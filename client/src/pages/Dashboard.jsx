import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Play, Square, Users, BookOpen, Clock, Activity, ArrowUpRight, CheckCircle2, AlertCircle, Edit2, Trash2, Save, X } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, activeSession: null });
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editData, setEditData] = useState({ name: '', rollNumber: '', course: '' });

    const handleEdit = (student) => {
        setEditingStudent(student._id);
        setEditData({ name: student.name, rollNumber: student.rollNumber, course: student.course });
    };

    const handleUpdate = async (id) => {
        try {
            await api.put(`/students/${id}`, editData);
            setEditingStudent(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update identity record.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('CRITICAL ACTION: Are you sure you want to completely erase this identity and its bio-hashes from the system?')) return;
        try {
            await api.delete(`/students/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to erase identity record.');
        }
    };

    const fetchData = async () => {
        try {
            const [studentsRes, attendanceRes, sessionsRes, subjectsRes] = await Promise.all([
                api.get('/students'),
                api.get('/attendance'),
                api.get('/sessions'),
                api.get('/subjects')
            ]);
            
            const today = new Date().toDateString();
            const todayRecords = (attendanceRes.data || []).filter(record => new Date(record.timestamp).toDateString() === today);
            
            setStats({
                totalStudents: (studentsRes.data || []).length,
                todayAttendance: todayRecords.length,
                activeSession: (sessionsRes.data || [])[0] || null
            });
            setSubjects(subjectsRes.data || []);
            if (subjectsRes.data?.length > 0) setSelectedSubject(subjectsRes.data[0]._id);
            setStudents(studentsRes.data || []);
        } catch (err) {
            console.error('Failed to load stats', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const startSession = async () => {
        if (!selectedSubject) return;
        try {
            await api.post('/sessions', { subjectId: selectedSubject });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start session');
        }
    };

    const endSession = async () => {
        if (!stats.activeSession) return;
        try {
            await api.put(`/sessions/${stats.activeSession._id}/end`);
            fetchData();
        } catch (err) {
            alert('Failed to end session');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold text-sm uppercase tracking-widest animate-pulse">Synchronizing Intelligence...</p>
        </div>
    );

    return (
        <div className="fade-in space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-display">Intelligence Dashboard</h1>
                    <p className="text-on-surface-variant font-medium text-lg">
                        Academic Session: {new Date().getFullYear()} • <span className="text-primary font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-2xl">
                    <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-white text-primary shadow-sm hover:shadow-md">Overview</button>
                    <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-on-surface-variant hover:text-primary">Detailed Logs</button>
                </div>
            </header>
            
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="sentinel-card group overflow-hidden relative">
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Total Students</span>
                            <div className="bg-primary/5 text-primary p-2.5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Users size={22} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <h2 className="text-6xl font-black font-display tracking-tight leading-none">{stats.totalStudents}</h2>
                            <div className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2.5 py-1 rounded-lg">
                                <ArrowUpRight size={16} /> 12%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sentinel-card group overflow-hidden relative">
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Attendance %</span>
                            <div className="bg-green-50 text-green-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <CheckCircle2 size={22} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <h2 className="text-6xl font-black font-display tracking-tight leading-none text-green-600">
                                {stats.totalStudents > 0 ? Math.round((stats.todayAttendance / stats.totalStudents) * 100) : 0}%
                            </h2>
                            <div className="text-xs font-bold uppercase tracking-widest text-green-600/60 pb-1">Excellent</div>
                        </div>
                    </div>
                </div>

                <div className="sentinel-card group relative bg-primary text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-[0.15em] text-white/60 text-shadow-sm">Current Node Status</span>
                            <div className="bg-white/10 p-2.5 rounded-2xl text-white">
                                <Activity size={22} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-2xl font-bold font-display leading-tight tracking-tight">
                                {stats.activeSession ? stats.activeSession.subject?.name : 'Scanner Standby'}
                            </h4>
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${stats.activeSession ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className="text-sm font-bold uppercase tracking-widest text-white/60">
                                    {stats.activeSession ? 'Live & Recognizing' : 'Awaiting Trigger'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Session Management Section */}
                <div className="lg:col-span-2 sentinel-card h-full min-h-[400px]">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/5 rounded-xl text-primary"><Play size={20} fill="currentColor"/></div>
                            Scanner Node Deployment
                        </h2>
                    </div>
                    
                    {stats.activeSession ? (
                        <div className="flex flex-col gap-8">
                            <div className="bg-surface-container-low p-10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6 text-left w-full md:w-auto">
                                        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black animate-pulse shadow-xl shadow-primary/20">
                                            ON
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-800 text-3xl font-display leading-tight">{stats.activeSession.subject?.name}</h4>
                                            <p className="text-on-surface-variant font-medium flex items-center gap-2 mt-1">
                                                <Clock size={16} /> Broadcast started at {new Date(stats.activeSession.startTime).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={endSession} className="btn-secondary text-red-600 hover:bg-red-50 w-full md:w-auto justify-center !px-10">
                                        <Square size={18} fill="currentColor"/> Terminate Session
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="sentinel-card p-8 !bg-surface-container-low !shadow-none border border-black/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Gate Signal</p>
                                    <h5 className="text-xl font-bold mb-4 font-display text-primary">Main Hall - Gate 04</h5>
                                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">System is transmitting recognized identity hashes to the central registry for subject: {stats.activeSession.subject?.name}.</p>
                                </div>
                                <div className="sentinel-card p-8 !bg-surface-container-low !shadow-none border border-black/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Target Goal</p>
                                    <h5 className="text-xl font-bold mb-4 font-display text-green-600">92.0% Threshold</h5>
                                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">Current recognized count: <span className="text-primary font-black text-sm">{stats.todayAttendance}</span>. Real-time metric tracking is engaged for this session.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 flex flex-col justify-center h-[300px]">
                            <div className="text-center space-y-3">
                                <div className="bg-primary/5 p-4 rounded-3xl inline-block text-primary mb-2">
                                    <Activity size={48} className="animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold font-display">No Active Deployment</h3>
                                <p className="text-on-surface-variant max-w-sm mx-auto font-medium">Select an intelligence target (subject) below to deploy the facial recognition scanner node.</p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-4 bg-surface-container-low p-3 rounded-2xl border border-black/5 max-w-2xl mx-auto w-full">
                                <select 
                                    value={selectedSubject} 
                                    onChange={e => setSelectedSubject(e.target.value)}
                                    className="flex-1 bg-white rounded-xl px-6 py-4 outline-none border-none ring-0 focus:shadow-md transition-all text-gray-700 font-bold"
                                >
                                    <option value="">Select Domain...</option>
                                    {subjects.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name === sub.code || sub.name.replace(/\s/g, '') === sub.code ? sub.name : `${sub.name} (${sub.code})`}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={startSession} className="btn-primary w-full md:w-auto justify-center">
                                    <Play size={18} fill="currentColor"/> Deploy Node
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Column */}
                <div className="sentinel-card group border border-transparent hover:border-primary/10 transition-colors h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold font-display">System Integrity</h3>
                        <Activity className="text-primary group-hover:rotate-12 transition-transform" size={20} />
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
                            <div className="bg-green-100 text-green-600 p-2 rounded-xl"><CheckCircle2 size={18}/></div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-green-600">Model Hash Verified</p>
                                <p className="text-sm text-on-surface font-semibold italic opacity-70">"Intelligence models synchronized."</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Activity size={18}/></div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Webcam Latency</p>
                                <p className="text-sm text-on-surface font-semibold italic opacity-70">"Packet delivery optimal (12ms)."</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low transition-colors">
                            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20"><Activity size={18}/></div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-primary">Node Location</p>
                                <p className="text-sm text-on-surface font-bold">Main Hall - Gate 04</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-surface-container-low rounded-3xl p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 italic">AI Threat Monitoring</p>
                            <h5 className="text-2xl font-black font-display tracking-tight text-on-surface">No Anomalies</h5>
                            <button className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                                VIEW LOGS <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registered Students Section */}
            <div className="sentinel-card mt-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-xl text-primary"><Users size={20} fill="currentColor"/></div>
                        Registered Identities Registry
                    </h2>
                </div>
                
                <div className="bg-white border-4 border-surface-container-high rounded-[32px] p-2 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-lowest">
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 rounded-tl-2xl">Identity Name</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Hash ID (Roll No)</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Course Domain</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 text-right">Biometric Status</th>
                                    <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 text-right rounded-tr-2xl w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-5 font-bold text-gray-800">
                                            {editingStudent === student._id ? (
                                                <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-sm focus:ring-2 focus:ring-primary/20" />
                                            ) : student.name}
                                        </td>
                                        <td className="p-5 font-black font-display text-primary">
                                            {editingStudent === student._id ? (
                                                <input type="text" value={editData.rollNumber} onChange={e => setEditData({...editData, rollNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-sm focus:ring-2 focus:ring-primary/20" />
                                            ) : student.rollNumber}
                                        </td>
                                        <td className="p-5 font-medium text-on-surface-variant">
                                            {editingStudent === student._id ? (
                                                <input type="text" value={editData.course} onChange={e => setEditData({...editData, course: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-sm focus:ring-2 focus:ring-primary/20" />
                                            ) : student.course}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700">
                                                <CheckCircle2 size={12} />
                                                {student.faceDescriptors?.length || 0} Samples Locked
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {editingStudent === student._id ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => handleUpdate(student._id)} className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors" title="Save Identity"><Save size={16}/></button>
                                                    <button onClick={() => setEditingStudent(null)} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors" title="Cancel Actions"><X size={16}/></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(student)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Modify Record"><Edit2 size={16}/></button>
                                                    <button onClick={() => handleDelete(student._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Erase Identity"><Trash2 size={16}/></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-sm font-bold uppercase tracking-widest text-on-surface-variant/50">No identities registered in the system.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
