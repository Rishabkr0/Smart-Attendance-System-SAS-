import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api/axios';
import { Camera, CheckCircle, AlertCircle, Scan, Activity, Clock, LogIn, Maximize2, ShieldAlert } from 'lucide-react';

const Scanner = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [logs, setLogs] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const pendingRequests = useRef(new Set());
    const intervalRef = useRef();

    const addLog = (msg) => {
        setLogs(prev => [msg, ...prev].slice(0, 15));
    };

    const markAttendance = async (studentId, session) => {
        try {
            await api.post('/attendance', {
                studentId,
                sessionId: session._id,
                subjectId: session.subject?._id || session.subject
            });
            const student = students.find(s => s._id === studentId);
            addLog(`✅ Marked ${student?.name} Present`);
        } catch (err) {
            if (err.response?.status !== 400) {
                console.error(err);
                addLog(`❌ Attendance failed: ${err.message}`);
            }
        }
    };

    const stopScanning = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsScanning(false);
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
            .then(stream => { 
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                    };
                }
            })
            .catch(err => {
                console.error(err);
                addLog("❌ Webcam access failed.");
            });
    };

    const startScanning = async () => {
        if (!selectedSession || students.length === 0 || !isModelLoaded) {
            addLog("⚠️ Ensure models are loaded and session is selected.");
            return;
        }

        const labeledDescriptors = students.map(student => {
            if (!student.faceDescriptors || student.faceDescriptors.length === 0) return null;
            const descriptors = student.faceDescriptors.map(desc => new Float32Array(desc));
            return new faceapi.LabeledFaceDescriptors(student._id, descriptors);
        }).filter(ld => ld !== null);

        if (labeledDescriptors.length === 0) {
            addLog("⚠️ No registered students with face data found.");
            return;
        }

        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) return;

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        pendingRequests.current.clear();
        setIsScanning(true);
        addLog("🚀 Intelligence Engine Engaged...");

        intervalRef.current = setInterval(async () => {
            if (!video || video.paused || video.ended) return;

            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Custom drawing logic to match Sentinel "Broken Corner" aesthetic
            resizedDetections.forEach(detection => {
                const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                const { x, y, width, height } = detection.detection.box;
                const matchText = bestMatch.toString();
                
                // Draw manual "broken corners"
                ctx.strokeStyle = '#e0e0ff'; // primary_fixed
                ctx.lineWidth = 3;
                
                const len = width * 0.2;
                
                // Top Left
                ctx.beginPath();
                ctx.moveTo(x, y + len);
                ctx.lineTo(x, y);
                ctx.lineTo(x + len, y);
                ctx.stroke();
                
                // Top Right
                ctx.beginPath();
                ctx.moveTo(x + width - len, y);
                ctx.lineTo(x + width, y);
                ctx.lineTo(x + width, y + len);
                ctx.stroke();
                
                // Bottom Left
                ctx.beginPath();
                ctx.moveTo(x, y + height - len);
                ctx.lineTo(x, y + height);
                ctx.lineTo(x + len, y + height);
                ctx.stroke();
                
                // Bottom Right
                ctx.beginPath();
                ctx.moveTo(x + width - len, y + height);
                ctx.lineTo(x + width, y + height);
                ctx.lineTo(x + width, y + height - len);
                ctx.stroke();

                // Draw Label with Sentinel styling
                ctx.fillStyle = '#202983'; // primary
                ctx.font = 'bold 16px Manrope';
                const labelWidth = ctx.measureText(matchText).width;
                ctx.fillRect(x, y - 30, labelWidth + 20, 30);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(matchText, x + 10, y - 8);

                if (bestMatch.label !== 'unknown') {
                    const studentId = bestMatch.label;
                    if (!pendingRequests.current.has(studentId)) {
                        const session = sessions.find(s => s._id === selectedSession);
                        if (session) {
                            pendingRequests.current.add(studentId);
                            markAttendance(studentId, session);
                        }
                    }
                }
            });
        }, 600); 
    };

    useEffect(() => {
        const init = async () => {
            try {
                // Using CDN for models to avoid local file corruption issues
                const modelPath = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
                addLog("🔍 Fetching system parameters...");
                
                const [studRes, sessRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/sessions')
                ]);
                setStudents(studRes.data);
                setSessions(sessRes.data);
                if (sessRes.data.length > 0) setSelectedSession(sessRes.data[0]._id);

                addLog("🔍 Initializing Bio-Recognition Engine...");
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
                    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
                ]);
                
                setIsModelLoaded(true);
                addLog("✅ Bio-Engine Ready for scanning.");
                startVideo();
            } catch (err) {
                console.error("Initialization error details:", err);
                addLog("❌ System Init Error: " + (err.message || err.toString()));
                if (err.message && err.message.includes('tensor')) {
                   addLog("💡 Critical: Model integrity violation detected.");
                }
            }
        };
        init();

        const currentVideo = videoRef.current;
        return () => {
            stopScanning();
            if (currentVideo && currentVideo.srcObject) {
                currentVideo.srcObject.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="fade-in space-y-8 h-full flex flex-col max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold font-display">Live Bio-Scanner</h1>
                    <p className="text-on-surface-variant font-medium text-lg italic">Recognizing identity in real-time environments.</p>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-2xl">
                    <select 
                        value={selectedSession} 
                        onChange={e => {
                            setSelectedSession(e.target.value);
                            stopScanning();
                        }}
                        className="bg-white border-none text-on-surface font-bold rounded-xl px-6 py-2.5 outline-none focus:ring-0 shadow-sm transition-all text-sm w-[280px]"
                    >
                        <option value="">Choose Target Session...</option>
                        {sessions.map(s => (
                            <option key={s._id} value={s._id}>{s.subject?.name || 'Unknown'} - {new Date(s.startTime).toLocaleTimeString()}</option>
                        ))}
                    </select>
                    {!isScanning ? (
                        <button onClick={startScanning} className="btn-primary !px-10 !py-2.5">
                            <Scan size={18} /> Initiate Scan
                        </button>
                    ) : (
                        <button onClick={stopScanning} className="bg-red-500 hover:bg-red-600 text-white px-10 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-red-200">
                            <ShieldAlert size={18} /> Disengage
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 items-stretch min-h-0">
                <div className="lg:col-span-3 relative bg-surface-container-highest rounded-[40px] overflow-hidden shadow-2xl group flex-1">
                    {/* Scanner Glass HUD Components */}
                    <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
                        <div className="sentinel-glass rounded-2xl p-4 flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${isScanning ? 'bg-primary text-white animate-pulse' : 'bg-on-surface/10 text-on-surface'}`}>
                                <Camera size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 leading-none mb-1">Optical Stream</p>
                                <p className="font-bold text-sm leading-none">{isScanning ? 'LIVE FEEDING' : 'READY TO FEED'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-8 right-8 z-20 flex flex-col gap-4">
                         <div className="sentinel-glass rounded-2xl p-4 flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60 leading-none mb-1">Engine Latency</p>
                                <p className="font-bold text-sm leading-none">12.4ms</p>
                            </div>
                            <Activity size={20} className="text-primary" />
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-8 z-20">
                         <div className="sentinel-glass rounded-2xl px-6 py-4 flex items-center gap-4 animate-scale-up">
                            <LogIn size={20} className="text-primary" />
                            <div className="h-6 w-[2px] bg-primary/20"></div>
                            <p className="text-sm font-extrabold font-display">Gate Protocol 04-B</p>
                        </div>
                    </div>

                    {!isModelLoaded && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 text-on-surface bg-surface-container-highest/90 backdrop-blur-3xl">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <div className="text-center space-y-1">
                                <h3 className="text-xl font-bold font-display uppercase tracking-widest">Bio-Engine Sync</h3>
                                <p className="font-medium opacity-60">Synthesizing intelligence parameters...</p>
                            </div>
                        </div>
                    )}
                    
                    <video ref={videoRef} className="w-full h-full object-cover" muted />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
                    
                    {/* Viewport Corners Decors */}
                    <div className="absolute top-0 left-0 p-8 z-0">
                         <Maximize2 size={64} className="text-white/20 -rotate-90" />
                    </div>
                </div>
                
                <div className="sentinel-card !p-0 !bg-surface-container-low border border-black/5 flex flex-col h-full lg:max-h-full min-h-[400px]">
                    <div className="p-8 border-b border-on-surface/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2">
                             <Activity size={16} /> Intelligence Logs
                        </h3>
                        <div className="flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                             <span className="text-[10px] font-bold text-green-600">Active</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-sentinel">
                        {logs.map((log, i) => (
                            <div key={i} className={`text-xs p-4 rounded-2xl border transition-all animate-fade-in ${
                                log.includes('✅') ? 'bg-white border-primary/20 text-on-surface font-bold shadow-sm' : 
                                log.includes('❌') ? 'bg-red-50 border-red-200 text-red-800 font-bold' : 
                                'bg-white/50 border-transparent text-on-surface-variant font-medium'
                            }`}>
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40 grayscale space-y-4">
                               <ShieldAlert size={48} />
                               <p className="text-xs font-bold uppercase tracking-widest">Node Standby</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scanner;
