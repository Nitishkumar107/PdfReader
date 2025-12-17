import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, FileText, AlignLeft } from 'lucide-react';

const Reader = ({ text, summary, marks = [], currentTime = 0 }) => {
    const [copiedText, setCopiedText] = useState(false);
    const [copiedSummary, setCopiedSummary] = useState(false);
    const activeRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const handleCopy = (content, setCopied) => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Auto-scroll to active element
    useEffect(() => {
        if (activeRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = activeRef.current;

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Check if element is out of view or close to edges (with 100px buffer)
            const isOutOfView =
                elementRect.top < containerRect.top + 100 ||
                elementRect.bottom > containerRect.bottom - 100;

            if (isOutOfView) {
                // Calculate scroll position relative to container
                const scrollTop = element.offsetTop - container.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);

                container.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTime]);

    // Render text with highlighting
    const renderText = () => {
        if (!text) {
            return (
                <span className="text-gray-500 italic flex flex-col items-center justify-center h-64 gap-4">
                    <FileText size={48} className="opacity-20" />
                    Upload a document to begin reading...
                </span>
            );
        }

        if (!marks || marks.length === 0) {
            return text;
        }

        return marks.map((mark, index) => {
            const isActive = currentTime >= mark.start && currentTime < mark.end;
            return (
                <span
                    key={index}
                    ref={isActive ? activeRef : null}
                    className={`transition-colors duration-300 rounded px-1 ${isActive ? 'bg-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''
                        }`}
                >
                    {mark.text}
                </span>
            );
        });
    };

    return (
        <div
            className="glass-panel p-8 flex flex-col gap-8 relative overflow-hidden"
            style={{ height: 'calc(100vh - 140px)' }}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

            {summary && (
                <div className="group relative bg-slate-900/50 border border-purple-500/20 rounded-2xl p-6 transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 flex-none">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-purple-400" />
                            <h3 className="text-purple-300 font-semibold uppercase tracking-wider text-xs">AI Summary</h3>
                        </div>
                        <button
                            onClick={() => handleCopy(summary, setCopiedSummary)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            title="Copy Summary"
                        >
                            {copiedSummary ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {summary}
                    </p>
                </div>
            )}

            <div className="flex-1 relative min-h-0">
                <div className="absolute inset-0 flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 flex-none">
                        <div className="flex items-center gap-2">
                            <AlignLeft size={18} className="text-blue-400" />
                            <h3 className="text-blue-300 font-semibold uppercase tracking-wider text-xs">Extracted Content</h3>
                        </div>
                        <button
                            onClick={() => handleCopy(text, setCopiedText)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            title="Copy Content"
                            disabled={!text}
                        >
                            {copiedText ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto custom-scrollbar pr-2 scroll-smooth"
                    >
                        <div className="prose prose-invert max-w-none pb-8">
                            <p className="text-gray-200 leading-loose whitespace-pre-wrap text-lg font-light tracking-wide">
                                {renderText()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reader;
