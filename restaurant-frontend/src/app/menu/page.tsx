'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, Modal } from '@/components';
import {
    Plus,
    Search,
    Filter,
    Pencil,
    Trash2,
    Utensils,
    Image as ImageIcon,
    Save,
    ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { menuService, MenuItem, Category } from '@/services/menuService';

export default function MenuPage() {
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: '',
        price: 0,
        description: '',
        category_id: undefined,
        is_available: true
    });
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

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
            const [items, cats] = await Promise.all([
                menuService.getMenuItems(),
                menuService.getCategories()
            ]);
            setMenuData(items);
            setCategories(cats);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                description: item.description,
                category_id: (item.category as any)?.id,
                is_available: item.is_available,
                image_url: item.image_url
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                price: 0,
                description: '',
                category_id: categories[0]?.id,
                is_available: true,
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await menuService.updateMenuItem(editingItem.id, formData);
            } else {
                await menuService.createMenuItem(formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Save failed', err);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const newCat = await menuService.createCategory(newCategoryName);
            setCategories([...categories, newCat]);
            setFormData({ ...formData, category_id: newCat.id });
            setNewCategoryName('');
            setIsAddingCategory(false);
        } catch (err) {
            console.error('Failed to add category', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
            try {
                await menuService.deleteMenuItem(id);
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

            <main className="flex-1 lg:pr-80 min-h-screen p-6 lg:p-8 transition-all">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <Utensils className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">قائمة الطعام</h1>
                            <p className="text-gray-400 dark:text-gray-500 text-[13px] font-bold opacity-70">إدارة الأصناف والأسعار</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl shadow-lg shadow-violet-600/15 active:scale-95 transition-all font-black text-xs"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة صنف
                    </button>
                </header>

                <section className="bg-card dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/40 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="بحث في المنيو..."
                                className="w-full h-10 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-violet-600/10 rounded-xl pr-10 pl-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-right" dir="rtl">
                            <thead>
                                <tr className="bg-gray-50/30 dark:bg-gray-900/20 border-b border-gray-50 dark:border-gray-800/40">
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الصنف</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الفئة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">السعر</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none">الحالة</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest leading-none text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold italic">جاري التحميل...</td></tr>
                                ) : menuData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Utensils className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <span className="font-black text-gray-900 dark:text-gray-200">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-violet-50 dark:bg-violet-900/10 text-violet-600 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                                                {item.category?.name || 'عام'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-violet-600 tabular-nums">
                                            {item.price} <span className="text-[10px] opacity-70">ج.م</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black ${item.is_available ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'}`}>
                                                {item.is_available ? 'متاح' : 'غير متاح'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 bg-violet-50/50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 rounded-xl hover:scale-110 transition-all border border-violet-100 dark:border-violet-900/30"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                title={editingItem ? 'تعديل صنف' : 'إضافة صنف جديد'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">اسم الصنف</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-600/10"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">السعر (ج.م)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-600/10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between mr-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الفئة</label>
                            <button
                                type="button"
                                onClick={() => setIsAddingCategory(!isAddingCategory)}
                                className="text-[10px] font-black text-violet-600 hover:text-violet-700 uppercase tracking-widest"
                            >
                                {isAddingCategory ? 'إلغاء' : '+ فئة جديدة'}
                            </button>
                        </div>

                        {isAddingCategory ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="اسم الفئة الجديدة..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 h-10 bg-gray-50 dark:bg-gray-950/40 border border-violet-200 dark:border-violet-900/30 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-600/10"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="px-4 h-10 bg-violet-600 text-white rounded-xl font-black text-xs shadow-lg shadow-violet-600/10 active:scale-95 transition-all"
                                >
                                    إضافة
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                                    className="w-full h-10 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-600/10 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>اختر الفئة...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-violet-600 transition-colors" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">الوصف</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-20 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-600/10 resize-none"
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl">
                        <input
                            type="checkbox"
                            checked={formData.is_available}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            id="is_available"
                            className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600/10"
                        />
                        <label htmlFor="is_available" className="text-sm font-bold text-gray-600 dark:text-gray-400 underline decoration-dotted">متاح للطلب الآن</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {editingItem ? 'حفظ التعديلات' : 'إضافة إلى القائمة'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
