'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, Modal } from '@/components';
import {
    Truck,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Table as TableIcon,
    DollarSign,
    Save
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';

export default function OrdersPage() {
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        setIsClient(true);
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchOrders();
        }
    }, [isLoggedIn, router]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Fetch orders failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            await orderService.updateOrder(orderId, { status: newStatus });
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            console.error('Update status failed', err);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">مكتمل</span>;
            case 'pending':
                return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-50 dark:bg-amber-950/20 text-amber-600">قيد الانتظار</span>;
            case 'cancelled':
                return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-50 dark:bg-rose-950/20 text-rose-600">ملغي</span>;
            case 'preparing':
                return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black bg-sky-50 dark:bg-sky-950/20 text-sky-600">قيد التحضير</span>;
            default:
                return <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black bg-gray-50 dark:bg-gray-900 text-gray-500">{status}</span>;
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
                        <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <Truck className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">الطلبات</h1>
                            <p className="text-gray-400 dark:text-gray-500 text-[13px] font-bold opacity-70">إدارة الطلبات النشطة</p>
                        </div>
                    </div>
                </header>

                <section className="bg-card dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/40 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="بحث عن طلب..."
                                className="w-full h-10 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-rose-600/10 rounded-xl pr-10 pl-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-right" dir="rtl">
                            <thead>
                                <tr className="bg-gray-50/30 dark:bg-gray-900/20 border-b border-gray-50 dark:border-gray-800/40">
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">رقم الطلب</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الطاولة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">المبلغ</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الوقت</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الحالة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-bold italic">جاري التحميل...</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors group">
                                        <td className="px-6 py-4 font-black text-gray-900 dark:text-gray-200">#{order.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-400 dark:text-gray-500">
                                            {order.table_number ? `طاولة ${order.table_number}` : 'تيك أواي'}
                                        </td>
                                        <td className="px-6 py-4 font-black text-rose-600 italic">
                                            {order.total_amount} <span className="text-[10px] not-italic mr-0.5">د.ل</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-semibold tabular-nums text-xs">
                                            {new Date(order.order_date_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setIsDetailsModalOpen(true); }}
                                                    className="p-2 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl hover:scale-110 transition-all border border-rose-100 dark:border-rose-900/30"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                        className="p-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:scale-110 transition-all border border-emerald-100 dark:border-emerald-900/30"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title={`تفاصيل الطلب #${selectedOrder?.id}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <TableIcon className="w-4 h-4 text-rose-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المكان</span>
                                </div>
                                <div className="text-sm font-black text-gray-900 dark:text-white">
                                    {selectedOrder.table_number ? `طاولة ${selectedOrder.table_number}` : 'سفري / تيك أواي'}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-rose-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الوقت</span>
                                </div>
                                <div className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                                    {new Date(selectedOrder.order_date_time).toLocaleTimeString('en-GB')}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">الأصناف</h3>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-xl border border-gray-50 dark:border-gray-800/40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-rose-100 dark:bg-rose-950/30 rounded-lg flex items-center justify-center text-[10px] font-black text-rose-600">
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 dark:text-white">{item.menu_item.name}</div>
                                                {item.notes && <div className="text-[10px] text-gray-400 font-bold">{item.notes}</div>}
                                            </div>
                                        </div>
                                        <div className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                                            {(item.unit_price * item.quantity).toFixed(2)} د.ل
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400">
                                <span>المجموع الفرعي</span>
                                <span className="tabular-nums">{(selectedOrder.total_amount + selectedOrder.discount_amount).toFixed(2)} د.ل</span>
                            </div>
                            {selectedOrder.discount_amount > 0 && (
                                <div className="flex justify-between text-xs font-bold text-rose-600">
                                    <span>الخصم</span>
                                    <span className="tabular-nums">-{selectedOrder.discount_amount.toFixed(2)} د.ل</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white border-t border-dashed border-gray-200 dark:border-gray-800 pt-2">
                                <span>الإجمالي</span>
                                <span className="tabular-nums">{selectedOrder.total_amount.toFixed(2)} د.ل</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {selectedOrder.status !== 'completed' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    تحديد كمكتمل
                                </button>
                            )}
                            {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                                    className="flex-1 h-11 bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <XCircle className="w-4 h-4" />
                                    إلغاء الطلب
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
