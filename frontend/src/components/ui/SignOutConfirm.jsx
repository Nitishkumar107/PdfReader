import React, { useState } from 'react';
import { SignOutButton } from "@clerk/clerk-react";
import { LogOut, X } from 'lucide-react';

const SignOutConfirm = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/20 flex items-center gap-2"
                title="Sign Out"
            >
                <LogOut size={18} />
                <span>Sign Out</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
                        <p className="text-gray-400 mb-6">Are you sure you want to end your session?</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <SignOutButton>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-500/20">
                                    Confirm Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignOutConfirm;
