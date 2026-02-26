'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, Modal } from '@/components';
import {
    Building2,
    Search,
    Filter,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Save,
    Calendar,
    Clock,
    Hash
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { paymentService, Payment } from '@/services/paymentService';

export default function PaymentsPage() {
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Summary state
    const [dailyTotal, setDailyTotal] = useState(0);

    useEffect(() => {
        setIsClient(true);
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchData();
        }
    }, [isLoggedIn, router]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await paymentService.getPayments();
            setPayments(data);

            // Calculate daily total (simplified)
            const total = data.reduce((acc, curr) => acc + curr.amount, 0);
            setDailyTotal(total);
        } catch (err) {
            console.error('Fetch payments failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient || !isLoggedIn) return null;

    return (
        <div className="flex bg-background dark:bg-background min-h-screen transition-colors duration-300" dir="rtl">
            <Sidebar />

            <main className="flex-1 lg:pr-80 min-h-screen p-6 lg:p-8 transition-all">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                            <Building2 className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">المدفوعات</h1>
                            <p className="text-gray-400 dark:text-gray-500 text-[13px] font-bold opacity-70">سجل المعاملات المالية</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-card dark:bg-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800/40 shadow-sm flex items-center gap-5 transition-all hover:scale-[1.02]">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">إجمالي اليوم</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                                {dailyTotal.toFixed(2)}
                                <span className="text-xs font-bold text-gray-400 mr-1 italic">ج.م</span>
                            </h3>
                        </div>
                    </div>
                    <div className="bg-card dark:bg-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800/40 shadow-sm flex items-center gap-5 transition-all hover:scale-[1.02]">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-2xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">عدد المعاملات</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                                {payments.length.toString().padStart(2, '0')}
                            </h3>
                        </div>
                    </div>
                </div>

                <section className="bg-card dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/40 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="بحث برقم المعاملة..."
                                className="w-full h-10 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-orange-600/10 rounded-xl pr-10 pl-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-right" dir="rtl">
                            <thead>
                                <tr className="bg-gray-50/30 dark:bg-gray-900/20 border-b border-gray-50 dark:border-gray-800/40">
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">رقم المعاملة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">رقم الطلب</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">وسيلة الدفع</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">المبلغ</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">التوقيت</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none text-center">التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-bold italic">جاري التحميل...</td></tr>
                                ) : payments.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-900 dark:text-gray-200 uppercase tabular-nums">
                                                {txn.transaction_id || `TXN-${txn.id.toString().padStart(3, '0')}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-400 tabular-nums">#{txn.order_id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black ${txn.payment_method === 'card' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'}`}>
                                                {txn.payment_method === 'card' ? <CreditCard className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                                                {txn.payment_method === 'card' ? 'بطاقة' : 'نقدي'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-orange-600 italic">
                                            {txn.amount.toFixed(2)} <span className="text-[10px] not-italic mr-0.5">ج.م</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-semibold tabular-nums text-xs opacity-70">
                                            {new Date(txn.payment_date_time).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <button className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-orange-600 rounded-xl transition-all border border-gray-100 dark:border-gray-800">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
