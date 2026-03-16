
import React from 'react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface DashboardTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-100/50 p-2 rounded-xl w-fit">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-white text-facil-blue shadow-lg transform scale-105 ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                >
                    <span className="animate-icon-bounce">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
