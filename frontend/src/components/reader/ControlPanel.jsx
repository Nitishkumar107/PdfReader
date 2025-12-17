import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Languages, FileText, Settings, Globe, ChevronDown } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

const CustomDropdown = ({ options, value, onChange, placeholder, icon: Icon, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`input-field bg-slate-800 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                title={placeholder}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
                    <span className="truncate" style={{ color: 'white' }}>
                        {selectedOption ? selectedOption.label : (value || placeholder)}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar ring-1 ring-black/5">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`px-4 py-3 cursor-pointer text-sm transition-all duration-200 border-l-4 ${value === opt.value
                                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                                : 'border-transparent text-gray-900 hover:bg-gray-100 hover:text-black hover:border-gray-400'
                                }`}
                            style={{
                                backgroundColor: value === opt.value ? '#eff6ff' : 'white',
                                color: value === opt.value ? '#1e3a8a' : 'black',
                                fontWeight: value === opt.value ? 'bold' : 'normal'
                            }}
                            onMouseEnter={(e) => {
                                if (value !== opt.value) {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    e.currentTarget.style.color = 'black';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== opt.value) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'black';
                                }
                            }}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ControlPanel = ({
    voices,
    settings,
    setSettings,
    onPlay,
    isPlaying,
    onTranslate,
    onSummarize,
    isTranslating,
    isSummarizing,
    isPaused
}) => {

    const voiceOptions = voices.map(v => ({ value: v.ShortName, label: v.FriendlyName }));
    const langOptions = [
        { value: 'en', label: 'English (English)' },
        { value: 'es', label: 'Spanish (Español)' },
        { value: 'fr', label: 'French (Français)' },
        { value: 'de', label: 'German (Deutsch)' },
        { value: 'hi', label: 'Hindi (हिन्दी)' },
        { value: 'ja', label: 'Japanese (日本語)' },
        { value: 'zh-CN', label: 'Chinese (Simplified)' },
        { value: 'ru', label: 'Russian (Русский)' },
        { value: 'pt', label: 'Portuguese (Português)' }
    ];

    return (
        <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="text-blue-400" />
                <h2 className="text-xl font-semibold">Controls</h2>
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Voice</label>
                    {voices.length === 0 ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <CustomDropdown
                            options={voiceOptions}
                            value={settings.voice}
                            onChange={(val) => setSettings({ ...settings, voice: val })}
                            placeholder="Select Voice"
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Speed: {settings.rate}</label>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            value={parseInt(settings.rate)}
                            onChange={(e) => setSettings({ ...settings, rate: `${e.target.value > 0 ? '+' : ''}${e.target.value}%` })}
                            className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            title="Adjust Reading Speed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Pitch: {settings.pitch}</label>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            value={parseInt(settings.pitch)}
                            onChange={(e) => setSettings({ ...settings, pitch: `${e.target.value > 0 ? '+' : ''}${e.target.value}Hz` })}
                            className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            title="Adjust Voice Pitch"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/10">
                <button
                    onClick={onPlay}
                    className={`btn-primary flex items-center justify-center gap-2 w-full ${isPlaying && !isPaused ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                    title={isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Start Reading'}
                >
                    {isPlaying && !isPaused ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Read Aloud'}
                </button>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-400 mb-1">Translate To</label>
                    <CustomDropdown
                        options={langOptions}
                        value=""
                        onChange={(val) => onTranslate(val)}
                        placeholder="Select Language"
                        icon={Globe}
                        disabled={isTranslating}
                    />
                    {isTranslating && <p className="text-xs text-purple-300 animate-pulse">Translating...</p>}
                </div>

                <button
                    onClick={onSummarize}
                    disabled={isSummarizing}
                    className="glass-panel hover:bg-white/5 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    title="Generate an AI summary of the text"
                >
                    <FileText size={18} className="text-purple-400" />
                    {isSummarizing ? 'Generating Summary...' : 'Generate AI Summary'}
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
