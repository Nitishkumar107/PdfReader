import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { Mic } from 'lucide-react';

const SignInPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-4">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-4 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-4 shadow-xl">
                        <Mic size={40} className="text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        AI Voice Reader
                    </h1>
                    <p className="text-gray-400 text-lg">Your intelligent reading companion</p>
                </div>

                <SignIn
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/"
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "glass-panel shadow-2xl border-0 bg-white/5 backdrop-blur-xl",
                            headerTitle: "text-white text-xl",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all",
                            formFieldLabel: "text-gray-300",
                            formFieldInput: "bg-white/5 border-white/10 text-white focus:border-blue-500 transition-colors",
                            footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                            identityPreviewText: "text-white",
                            formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]",
                            dividerLine: "bg-white/10",
                            dividerText: "text-gray-500"
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default SignInPage;
