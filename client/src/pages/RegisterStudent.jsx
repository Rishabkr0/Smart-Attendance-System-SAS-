import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api/axios';
import { Camera, UserPlus, CheckCircle, AlertCircle, Trash2, ShieldCheck, Fingerprint, ScanEye, User } from 'lucide-react';

const RegisterStudent = () => {
    const videoRef = useRef();
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [faceDescriptors, setFaceDescriptors] = useState([]);
    const [formData, setFormData] = useState({ name: '', rollNumber: '', department: '' });
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const modelPath = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
                    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
                ]);
                setIsModelLoaded(true);
                startVideo();
            } catch (err) {
                console.error("Error loading models:", err);
                setStatus({ message: `AI Model Error: ${err.message || 'Check model files in public/models'}`, type: 'error' });
            }
        };
        loadModels();
        const currentVideo = videoRef.current;
        return () => {
            if (currentVideo && currentVideo.srcObject) {
                currentVideo.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
            .catch(err => setStatus({ message: 'Webcam access denied.', type: 'error' }));
    };

    const captureFace = async () => {
        if (!videoRef.current) return;
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        
        if (detection) {
            setFaceDescriptors(prev => [...prev, Array.from(detection.descriptor)]);
            setStatus({ message: `Sample ${faceDescriptors.length + 1} captured successfully.`, type: 'success' });
        } else {
            setStatus({ message: 'No face detected. Adjust lighting or angle.', type: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (faceDescriptors.length === 0) return setStatus({ message: 'Bio-samples required.', type: 'error' });
        
        setLoading(true);
        try {
            await api.post('/students', { 
                name: formData.name, 
                rollNumber: formData.rollNumber, 
                course: formData.department, 
                faceDescriptors 
            });
            setStatus({ message: 'Student successfully bio-enrolled.', type: 'success' });
            setFormData({ name: '', rollNumber: '', department: '' });
            setFaceDescriptors([]);
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Enrollment failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in space-y-8 max-w-7xl mx-auto pb-12">
            <header className="space-y-1">
                <h1 className="text-4xl font-extrabold font-display">New Identity Enrollment</h1>
                <p className="text-on-surface-variant font-medium text-lg">Synthesize biometric data and official credentials into the system.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="sentinel-card space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                        <div className="flex items-center gap-4 text-primary mb-2">
                             <div className="p-3 bg-primary/5 rounded-2xl"><User size={24} /></div>
                             <h2 className="text-2xl font-bold font-display tracking-tight">Personal Credentials</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">Full Identity Name</label>
                                <input 
                                    type="text" required placeholder="Marcus Henderson"
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-800 placeholder:opacity-30"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">System Hash / Roll Number</label>
                                <input 
                                    type="text" required placeholder="e.g. CS2024-001"
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-800 placeholder:opacity-30"
                                    value={formData.rollNumber}
                                    onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 px-1">Department / Domain</label>
                                <input 
                                    type="text" required placeholder="Computer Intelligence Engineering"
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-800 placeholder:opacity-30"
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="btn-primary w-full justify-center !py-5 shadow-xl shadow-primary/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ENROLLING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={20} />
                                    COMPLETE ENROLLMENT
                                </div>
                            )}
                        </button>
                    </form>

                    {status.message && (
                        <div className={`p-6 rounded-[32px] font-bold text-sm flex items-center gap-4 animate-scale-up ${
                            status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            {status.message}
                        </div>
                    )}
                </div>

                {/* Biometric Capture Section */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="sentinel-card !p-0 overflow-hidden aspect-video relative group border-4 border-white shadow-2xl">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                        
                        {/* Biometric HUD Layer */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute top-8 left-8 sentinel-glass rounded-2xl p-4 flex items-center gap-3">
                                <ScanEye className="text-primary animate-pulse" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric Capture active</span>
                            </div>
                            
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-20">
                                 <div className="w-64 h-80 border-2 border-white/30 rounded-[100px] border-dashed"></div>
                            </div>
                        </div>

                        {!isModelLoaded && (
                            <div className="absolute inset-0 z-20 bg-surface-container-highest/80 backdrop-blur-3xl flex flex-col items-center justify-center gap-4 text-on-surface">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="font-bold text-xs uppercase tracking-widest">Warming Intelligence...</p>
                            </div>
                        )}

                        <div className="absolute bottom-8 inset-x-8 z-20 flex items-center justify-between">
                             <div className="sentinel-glass rounded-2xl px-6 py-3 flex items-center gap-3">
                                <Fingerprint size={18} className="text-primary" />
                                <span className="text-xs font-bold font-display uppercase tracking-widest text-on-surface">Samples: {faceDescriptors.length}</span>
                             </div>
                             <button 
                                onClick={captureFace}
                                className="bg-primary hover:bg-primary-container text-white p-6 rounded-3xl shadow-2xl shadow-primary/40 active:scale-95 transition-all group pointer-events-auto"
                             >
                                <Camera size={28} className="group-hover:scale-110 transition-transform" />
                             </button>
                        </div>
                    </div>

                    <div className="sentinel-card flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold font-display tracking-tight flex items-center gap-2">
                                <Fingerprint size={20} className="text-primary" />
                                Enrolled Intelligence Samples
                            </h3>
                            <button onClick={() => setFaceDescriptors([])} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {faceDescriptors.map((_, i) => (
                                <div key={i} className="bg-surface-container-low px-6 py-3 rounded-2xl border border-primary/10 flex items-center gap-4 animate-scale-up group">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-xs font-bold text-on-surface">BioHash-{(i+1).toString().padStart(2, '0')}</span>
                                    <div className="h-4 w-[1px] bg-primary/10"></div>
                                    <ShieldCheck size={14} className="text-primary" />
                                </div>
                            ))}
                            {faceDescriptors.length === 0 && (
                                <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-on-surface/10 rounded-3xl">
                                    <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest opacity-40 italic">Awaiting first capture...</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                            <p className="text-xs font-semibold text-indigo-700 leading-relaxed italic">
                                **Sentinel Note:** Ensure the identity is well-lit. Capture at least 5 variants (slight angles) for maximum recognition precision during live scanning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudent;
