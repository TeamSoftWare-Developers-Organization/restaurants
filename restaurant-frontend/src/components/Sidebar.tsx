'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Home,
    Truck,
    LayoutDashboard,
    BadgeCheck,
    Snowflake,
    Building2,
    Moon,
    Sun,
    LogOut,
    ChevronLeft,
    User,
    ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const links = [
    { label: 'لوحة التحكم', icon: Home, href: '/', color: 'indigo' },
    { label: 'نقطة البيع', icon: ShoppingBag, href: '/pos', color: 'emerald' },
    { label: 'الموظفون', icon: User, href: '/employees', color: 'blue' },
    { label: 'المخزون', icon: Snowflake, href: '/inventory', color: 'amber' },
    { label: 'قائمة الطعام', icon: LayoutDashboard, href: '/menu', color: 'violet' },
    { label: 'الطلبات', icon: Truck, href: '/orders', color: 'rose' },
    { label: 'الحجوزات', icon: BadgeCheck, href: '/reservations', color: 'sky' },
    { label: 'المدفوعات', icon: Building2, href: '/payments', color: 'orange' }
];

const colorVariants: Record<string, string> = {
    indigo: 'bg-indigo-600 text-white shadow-indigo-600/20',
    emerald: 'bg-emerald-600 text-white shadow-emerald-600/20',
    blue: 'bg-blue-600 text-white shadow-blue-600/20',
    amber: 'bg-amber-600 text-white shadow-amber-600/20',
    violet: 'bg-violet-600 text-white shadow-violet-600/20',
    rose: 'bg-rose-600 text-white shadow-rose-600/20',
    sky: 'bg-sky-600 text-white shadow-sky-600/20',
    orange: 'bg-orange-600 text-white shadow-orange-600/20'
};

const hoverVariants: Record<string, string> = {
    indigo: 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10',
    emerald: 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10',
    blue: 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
    amber: 'hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10',
    violet: 'hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10',
    rose: 'hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10',
    sky: 'hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10',
    orange: 'hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'
};

export default function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

    return (
        <aside className="fixed inset-y-0 right-0 w-64 bg-card dark:bg-card border-l border-gray-100 dark:border-gray-800/40 z-50 transition-all duration-300 hidden lg:block shadow-[1px_0_15px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col h-full p-4">
                {/* Logo - Slightly Larger */}
                <div className="flex items-center gap-3 mb-8 px-2 py-1">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 rotate-3">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">إدارة المطعم</h1>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block -mt-0.5 opacity-60">نظام متكامل</span>
                    </div>
                </div>

                {/* Navigation - Comfortable spacing */}
                <nav className="flex-1 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href === '/stock' && pathname === '/');

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${isActive
                                    ? `${colorVariants[link.color]} shadow-md font-bold scale-[1.02]`
                                    : `text-gray-500 ${hoverVariants[link.color]} font-semibold`
                                    }`}
                            >
                                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-[13px]">{link.label}</span>
                                {isActive && <ChevronLeft className="mr-auto w-3 h-3 opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 space-y-1 border-t border-gray-100 dark:border-gray-800/30">
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-semibold"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="text-[13px]">{isDark ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-rose-500/80 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[13px]">تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
