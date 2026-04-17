import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Download, Calendar, User, BookOpen, FileText } from 'lucide-react';

const AttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            const res = await api.get('/attendance');
            setRecords(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const filteredRecords = records.filter(r => 
        r.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.subject?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Date', 'Time', 'Student', 'Subject', 'Status'];
        const rows = filteredRecords.map(r => [
            new Date(r.timestamp).toLocaleDateString(),
            new Date(r.timestamp).toLocaleTimeString(),
            r.student?.name,
            r.subject?.name,
            'Present'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentinel-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold text-sm uppercase tracking-widest animate-pulse">Filtering System Database...</p>
        </div>
    );

    return (
        <div className="fade-in space-y-10 max-w-7xl mx-auto pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-display">Archived Records</h1>
                    <p className="text-on-surface-variant font-medium text-lg">Secure history of recognized identities and academic sessions.</p>
                </div>
                <div className="flex items-center gap-4">
                     <button onClick={exportToCSV} className="btn-secondary !bg-primary !text-white !px-10 shadow-lg shadow-primary/20">
                         <Download size={18} /> Export Intelligence
                     </button>
                </div>
            </header>

            <div className="sentinel-card !p-0 overflow-hidden relative border border-black/5">
                <div className="p-8 border-b border-on-surface/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low/30">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                        <input 
                            type="text"
                            placeholder="Search identities or domains..."
                            className="w-full bg-white border-none rounded-[20px] pl-14 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-on-surface shadow-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-left">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-10">Timestamp</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Subject / Domain</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Identity Hash</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right pr-10">Access Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-0">
                            {filteredRecords.map((r, i) => (
                                <tr key={r._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container-low transition-colors group cursor-default`}>
                                    <td className="p-6 px-10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-surface-container-high p-2.5 rounded-xl text-on-surface-variant group-hover:text-primary transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <span className="font-bold text-on-surface">{new Date(r.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={18} className="text-on-surface-variant/40" />
                                            <span className="font-bold text-on-surface">{r.subject?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <User size={18} className="text-primary/40" />
                                            <div>
                                                <p className="font-black text-on-surface text-sm">{r.student?.name}</p>
                                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{r.student?.rollNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="bg-green-100/50 text-green-700 px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-green-200">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> RECOGNIZED
                                        </div>
                                    </td>
                                    <td className="p-6 text-right pr-10 italic text-sm font-semibold text-on-surface-variant">
                                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredRecords.length === 0 && (
                        <div className="p-24 text-center space-y-4">
                            <div className="p-6 bg-surface-container-low rounded-full inline-block text-on-surface-variant/20">
                                <FileText size={64} />
                            </div>
                            <h3 className="text-xl font-bold font-display opacity-40 capitalize">Intelligence registry is empty</h3>
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant/40 font-bold italic">awaiting recognizing signals...</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center justify-between text-on-surface-variant/60 font-bold text-[10px] uppercase tracking-widest px-8 italic">
                <span>Database Integrity: Optimal</span>
                <span>Active Synchronization engaged</span>
            </div>
        </div>
    );
};

export default AttendanceRecords;
