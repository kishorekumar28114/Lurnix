'use client';

import React from 'react';
import { Layout, FileText, ImageIcon, Type } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabsProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const tabs: Tab[] = [
    { id: 'text', label: 'Paste Text', icon: <Type className="w-4 h-4" /> },
    { id: 'document', label: 'Upload Document', icon: <FileText className="w-4 h-4" /> },
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
    return (
        <div className="flex p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                        activeTab === tab.id
                            ? "bg-white text-amber-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    )}
                >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
