
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mic, FileText, Globe, Check, Zap, MessageSquare } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
            {/* Navbar */}
            <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Mic size={24} className="text-blue-400" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        VoiceReader
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/sign-in">
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/sign-up">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-20 pb-32 text-center relative z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Transform Your PDFs into <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Interactive Audio
                    </span>
                </h1>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Listen to documents, summarize specific sections, and translate content instantly with our AI-powered reader.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link to="/sign-up">
                        <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0">
                            Start Reading for Free
                        </Button>
                    </Link>
                    <Link to="#demo">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 hover:text-white text-gray-300">
                            View Demo
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container mx-auto px-4 py-24 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Mic}
                        title="Natural Text-to-Speech"
                        description="Convert any PDF into human-like audio using advanced neural voices."
                    />
                    <FeatureCard
                        icon={FileText}
                        title="Smart Summaries"
                        description="Get concise AI summaries of long documents in seconds."
                    />
                    <FeatureCard
                        icon={Globe}
                        title="Instant Translation"
                        description="Translate your documents into 50+ languages with a single click."
                    />
                </div>
            </section>

            {/* How it Works / Social Proof */}
            <section id="testimonials" className="container mx-auto px-4 py-24 border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by professionals</h2>
                    <p className="text-gray-400">Join thousands of users converting documents to audio daily.</p>
                </div>
                {/* Placeholder for logos or stats */}
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                    {/* Add company logos here or stats blocks */}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#0f172a] py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Mic size={20} className="text-blue-400" />
                        </div>
                        <span className="font-bold text-gray-200">VoiceReader</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2024 AI Voice Reader. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-gray-400">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon size={24} className="text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-100">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
