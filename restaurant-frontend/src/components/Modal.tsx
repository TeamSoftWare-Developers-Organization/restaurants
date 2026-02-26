'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="bg-card dark:bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800/40 relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                <header className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/30 flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
