import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import FileUpload from './components/reader/FileUpload';
import ControlPanel from './components/reader/ControlPanel';
import Reader from './components/reader/Reader';
import ThemeToggle from './components/ui/ThemeToggle';
import SignOutConfirm from './components/ui/SignOutConfirm';
import { Mic, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
    // Load initial state from localStorage if available
    const [text, setText] = useState(() => localStorage.getItem('voice_reader_text') || '');
    const [summary, setSummary] = useState(() => localStorage.getItem('voice_reader_summary') || '');

    const [voices, setVoices] = useState([]);
    const [settings, setSettings] = useState({
        voice: 'en-US-AriaNeural',
        rate: '+0%',
        pitch: '+0Hz'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [audio, setAudio] = useState(null);
    const [marks, setMarks] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [userPlan, setUserPlan] = useState('free');

    const { user, isSignedIn } = useUser();

    // Sync user with backend
    useEffect(() => {
        const syncUser = async () => {
            if (isSignedIn && user) {
                try {
                    await axios.post(`${API_URL}/auth/sync`, {
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName
                    });
                    if (response.data.plan) {
                        setUserPlan(response.data.plan);
                    }
                } catch (error) {
                    console.error("Failed to sync user:", error);
                }
            }
        };
        syncUser();
    }, [isSignedIn, user]);

    // Auto-Save text and summary
    useEffect(() => {
        localStorage.setItem('voice_reader_text', text);
    }, [text]);

    useEffect(() => {
        localStorage.setItem('voice_reader_summary', summary);
    }, [summary]);

    // Backend Health Check
    useEffect(() => {
        const checkHealth = async () => {
            try {
                await axios.get(`${API_URL}/voices`);
            } catch (error) {
                toast.error("Connecting to backend...", { icon: '⚠️' });
                // Retry or show persistent error
            }
        };
        checkHealth();
    }, []);


    useEffect(() => {
        fetchVoices();
    }, []);

    const fetchVoices = async () => {
        try {
            const response = await axios.get(`${API_URL}/voices`);
            setVoices(response.data);
            if (response.data.length > 0) {
                setSettings(prev => ({ ...prev, voice: response.data[0].ShortName }));
            }
        } catch (error) {
            console.error('Error fetching voices:', error);
            toast.error("Failed to load voices. Backend might be down.");
        }
    };

    const handleFileUpload = async (file) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setText(response.data.text);
            setSummary(''); // Reset summary on new file
            toast.success("File uploaded successfully!");
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error("Error uploading file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemo = () => {
        setText("Artificial Intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals. Leading AI textbooks define the field as the study of \"intelligent agents\": any system that perceives its environment and takes actions that maximize its chance of achieving its goals. Some popular accounts use the term \"artificial intelligence\" to describe machines that mimic \"cognitive\" functions that humans associate with the human mind, such as \"learning\" and \"problem solving\".");
        setSummary('');
        toast.success("Demo text loaded!");
    };

    const [isPaused, setIsPaused] = useState(false);

    const handlePlay = async () => {
        if (!text) {
            toast.error("Please upload text first");
            return;
        }

        // If currently playing, toggle pause/resume
        if (isPlaying) {
            if (audio) {
                if (isPaused) {
                    audio.play();
                    setIsPaused(false);
                } else {
                    audio.pause();
                    setIsPaused(true);
                }
            }
            return;
        }

        setIsPlaying(true);
        setIsPaused(false);
        try {
            if (audio) {
                audio.pause();
                setAudio(null);
            }

            const response = await axios.post(`${API_URL}/tts`, {
                text,
                voice: settings.voice,
                rate: settings.rate,
                pitch: settings.pitch
            });

            setMarks(response.data.marks || []);

            const newAudio = new Audio(response.data.audio_url);
            newAudio.onended = () => {
                setIsPlaying(false);
                setIsPaused(false);
                setCurrentTime(0);
            };
            newAudio.ontimeupdate = () => {
                setCurrentTime(newAudio.currentTime);
            };
            newAudio.play();
            setAudio(newAudio);
        } catch (error) {
            console.error('Error generating TTS:', error);
            setIsPlaying(false);
            setIsPaused(false);
            toast.error("Failed to generate audio");
        }
    };

    const handleTranslate = async (targetLang) => {
        if (!text) return;
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/translate`, {
                text,
                target_lang: targetLang
            });
            setText(response.data.translated_text);
            toast.success("Translation complete!");
        } catch (error) {
            console.error('Error translating:', error);
            toast.error("Translation failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (!text) return;
        setIsSummarizing(true);
        try {
            const response = await axios.post(`${API_URL}/summarize`, {
                text,
                sentences_count: 5
            });
            setSummary(response.data.summary);
            toast.success("Summary generated!");
        } catch (error) {
            console.error('Error summarizing:', error);
            toast.error("Summarization failed");
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }} />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex-none">
                <header className="flex items-center justify-between w-full mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Mic size={32} className="text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                AI Voice Reader
                            </h1>
                            <p className="text-gray-400">Read, Listen, Translate & Summarize</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {userPlan === 'free' && (
                            <Link to="/pricing">
                                <Button size="sm" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 border-0">
                                    <Zap size={16} />
                                    Upgrade to Pro
                                </Button>
                            </Link>
                        )}
                        <SignOutConfirm />
                    </div>
                </header>
            </div>

            <div className="flex-1 container mx-auto px-4 pb-6 max-w-6xl min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    <div className="lg:col-span-4 h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        <FileUpload onFileUpload={handleFileUpload} onDemo={handleDemo} isLoading={isLoading} />
                        <ControlPanel
                            voices={voices}
                            settings={settings}
                            setSettings={setSettings}
                            onPlay={handlePlay}
                            isPlaying={isPlaying}
                            onTranslate={handleTranslate}
                            onSummarize={handleSummarize}
                            isSummarizing={isSummarizing}
                            isPaused={isPaused}
                            isTranslating={isLoading}
                        />
                    </div>

                    <div className="lg:col-span-8 h-full">
                        <Reader text={text} summary={summary} marks={marks} currentTime={currentTime} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

