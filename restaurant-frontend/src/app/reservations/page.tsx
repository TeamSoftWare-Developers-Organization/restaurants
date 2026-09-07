'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, Modal } from '@/components';
import {
    BadgeCheck,
    Plus,
    Search,
    Filter,
    Pencil,
    Trash2,
    Calendar,
    Clock,
    Save,
    User,
    Phone,
    Users
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useRouter } from 'next/navigation';
import { reservationService, Reservation, Table } from '@/services/reservationService';

export default function ReservationsPage() {
    const { isSidebarCollapsed } = useUIStore();
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [reservationsData, setReservationsData] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Reservation | null>(null);
    const [formData, setFormData] = useState<Partial<Reservation>>({
        customer_name: '',
        customer_phone: '',
        reservation_time: '',
        number_of_guests: 2,
        status: 'confirmed',
        table_id: undefined,
        notes: ''
    });

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
            const [resData, tablesData] = await Promise.all([
                reservationService.getReservations(),
                reservationService.getTables()
            ]);
            setReservationsData(resData);
            setTables(tablesData);
        } catch (err) {
            console.error('Fetch reservations failed', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Reservation) => {
        if (item) {
            setEditingItem(item);
            // Format datetime-local string (YYYY-MM-DDTHH:mm)
            const date = new Date(item.reservation_time);
            const formattedTime = date.toISOString().slice(0, 16);

            setFormData({
                customer_name: item.customer_name,
                customer_phone: item.customer_phone,
                reservation_time: formattedTime,
                number_of_guests: item.number_of_guests,
                status: item.status,
                table_id: item.table?.id,
                notes: item.notes || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                customer_name: '',
                customer_phone: '',
                reservation_time: '',
                number_of_guests: 2,
                status: 'confirmed',
                table_id: undefined,
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await reservationService.updateReservation(editingItem.id, formData);
            } else {
                await reservationService.createReservation(formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Save failed', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
            try {
                await reservationService.deleteReservation(id);
                fetchData();
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    if (!isClient || !isLoggedIn) return null;

    return (
        <div className="flex bg-background dark:bg-background min-h-screen transition-colors duration-300" dir="rtl">
            <Sidebar />

            <main className={`flex-1 ${isSidebarCollapsed ? 'lg:pr-20' : 'lg:pr-80'} min-h-screen p-6 lg:p-8 transition-all duration-300`}>
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20">
                            <BadgeCheck className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">الحجوزات</h1>
                            <p className="text-gray-400 dark:text-gray-500 text-[13px] font-bold opacity-70">إدارة الجداول والمواعيد</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-sky-600/15 active:scale-95 transition-all font-black text-xs"
                    >
                        <Plus className="w-4 h-4" />
                        حجز جديد
                    </button>
                </header>

                <section className="bg-card dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/40 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="بحث عن حجز..."
                                className="w-full h-10 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-sky-600/10 rounded-xl pr-10 pl-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-right" dir="rtl">
                            <thead>
                                <tr className="bg-gray-50/30 dark:bg-gray-900/20 border-b border-gray-50 dark:border-gray-800/40">
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الاسم</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الطاولة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">موعد الحجز</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الأشخاص</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الحالة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-bold italic">جاري التحميل...</td></tr>
                                ) : reservationsData.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-900 dark:text-gray-200">{res.customer_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold opacity-60 tabular-nums">{res.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-sky-600">
                                            {res.table ? `طاولة ${res.table.table_number}` : 'لم تحدد'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-semibold tabular-nums text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                {new Date(res.reservation_time).toLocaleDateString('en-GB')}
                                                <Clock className="w-3.5 h-3.5 opacity-40 mr-1" />
                                                {new Date(res.reservation_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-black tabular-nums">{res.number_of_guests}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black ${res.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'}`}>
                                                {res.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(res)}
                                                    className="p-2 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl hover:scale-110 transition-all border border-sky-100 dark:border-sky-900/30"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(res.id)}
                                                    className="p-2 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl hover:scale-110 transition-all border border-rose-100 dark:border-rose-900/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'تعديل الحجز' : 'إضافة حجز جديد'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">اسم العميل</label>
                        <input
                            type="text"
                            value={formData.customer_name}
                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                            className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">رقم الهاتف</label>
                            <input
                                type="text"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">عدد الأشخاص</label>
                            <input
                                type="number"
                                value={formData.number_of_guests}
                                onChange={(e) => setFormData({ ...formData, number_of_guests: parseInt(e.target.value) })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">موعد الحجز</label>
                        <input
                            type="datetime-local"
                            value={formData.reservation_time}
                            onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                            className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">الطاولة</label>
                            <select
                                value={formData.table_id}
                                onChange={(e) => setFormData({ ...formData, table_id: parseInt(e.target.value) })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 appearance-none"
                            >
                                <option value="">اختر طاولة</option>
                                {tables.map(table => (
                                    <option key={table.id} value={table.id}>طاولة {table.table_number} ({table.capacity} أشخاص)</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">الحالة</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 appearance-none"
                                required
                            >
                                <option value="pending">قيد الانتظار</option>
                                <option value="confirmed">مؤكد</option>
                                <option value="cancelled">ملغي</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">ملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full h-20 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-600/10 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {editingItem ? 'حفظ التعديلات' : 'إضافة الحجز'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
