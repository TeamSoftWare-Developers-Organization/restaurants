'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components';
import {
    ShoppingBag,
    Search,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Receipt,
    Utensils,
    Image as ImageIcon
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { menuService, MenuItem, Category } from '@/services/menuService';
import { orderService } from '@/services/orderService';

export default function POSPage() {
    const { isLoggedIn } = useAuthStore();
    const { items, addItem, removeItem, updateQuantity, clearCart, getTotals } = useCartStore();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>(['الكل']);

    const { subtotal, taxAmount, total } = getTotals();

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
            const [itemsData, categoriesData] = await Promise.all([
                menuService.getMenuItems(),
                menuService.getCategories()
            ]);
            setMenuItems(itemsData);
            setCategories(['الكل', ...categoriesData.map(c => c.name)]);
        } catch (err) {
            console.error('Failed to fetch POS data', err);
        }
    };

    if (!isClient || !isLoggedIn) return null;

    const filteredItems = menuItems.filter(item =>
        (activeCategory === 'الكل' || item.category?.name === activeCategory) &&
        item.name.includes(searchQuery)
    );

    return (
        <div className="flex bg-background dark:bg-background min-h-screen transition-colors duration-300" dir="rtl">
            <Sidebar />

            <main className="flex-1 lg:pr-80 min-h-screen flex flex-col xl:flex-row gap-6 p-6 lg:p-8 transition-all">
                {/* Menu Section */}
                <section className="flex-1 space-y-6">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                <Utensils className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">نقطة البيع</h1>
                                <p className="text-gray-400 dark:text-gray-500 text-[13px] font-bold opacity-70">المبيعات المباشرة</p>
                            </div>
                        </div>
                    </header>

                    {/* Search and Filters */}
                    <div className="relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="بحث عن منتج..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 bg-card dark:bg-card border border-gray-100 dark:border-gray-800/40 shadow-sm rounded-xl pr-11 pl-4 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-emerald-600/10"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-xl font-black text-xs transition-all shadow-sm border ${activeCategory === cat
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-card dark:bg-card text-gray-500 border-gray-100 dark:border-gray-800/40 hover:text-emerald-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-card dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/40 hover:shadow-xl transition-all group cursor-pointer active:scale-95 overflow-hidden flex flex-col"
                                onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                            >
                                <div className="w-full h-44 bg-gray-50/50 dark:bg-gray-900/40 relative overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Utensils className="w-10 h-10 text-gray-200 dark:text-gray-800" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-lg">
                                        <span className="text-white font-black text-xs tabular-nums">{item.price} ج.م</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-gray-200 truncate mb-1">{item.name}</h3>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.category?.name || 'عام'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Cart Section - Comfortable Slim */}
                <section className="w-full xl:w-[320px] bg-card dark:bg-card rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800/40 flex flex-col h-[calc(100vh-6rem)] sticky top-8 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800/40 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/20">
                        <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <ShoppingBag className="text-emerald-600 w-5 h-5" />
                            السلة
                        </h2>
                        <button
                            onClick={clearCart}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-8 opacity-30">
                                <ShoppingBag className="text-gray-200 dark:text-gray-800 w-12 h-12 mb-2" />
                                <p className="text-gray-400 font-black text-xs italic">السلة فارغة</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/40 p-3 rounded-xl border border-gray-100/50 dark:border-gray-800/20">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-gray-300 truncate">{item.name}</h4>
                                        <p className="text-emerald-600 font-black text-[11px] tabular-nums">{item.price} <span className="text-[9px] opacity-70">ج.م</span></p>
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-card dark:bg-card px-2 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800/50">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-gray-400 hover:text-emerald-600"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-black text-gray-900 dark:text-white text-xs min-w-[1rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-gray-400 hover:text-emerald-600"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Totals Section */}
                    <div className="p-5 bg-gray-50/30 dark:bg-gray-900/20 border-t border-gray-50 dark:border-gray-800/30 space-y-3">
                        <div className="flex justify-between text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none">
                            <span>الفرعي</span>
                            <span className="tabular-nums">{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600/70 font-bold text-[10px] uppercase tracking-widest leading-none">
                            <span>الضريبة</span>
                            <span className="tabular-nums">{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4 border-t border-gray-200 dark:border-gray-800/30">
                            <span className="text-sm font-black text-gray-900 dark:text-white">الإجمالي</span>
                            <span className="text-xl font-black text-emerald-600 italic tabular-nums">{total.toFixed(2)} <span className="text-xs not-italic mr-1">ج.م</span></span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={() => handleCheckout('cash')}
                                className="flex flex-col items-center justify-center h-12 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-xl font-bold transition-all text-[10px] border border-gray-200/50 dark:border-gray-800"
                            >
                                <Banknote className="w-4 h-4 mb-0.5" />
                                نقدي
                            </button>
                            <button
                                onClick={() => handleCheckout('card')}
                                className="flex flex-col items-center justify-center h-12 bg-emerald-600 text-white rounded-xl font-black shadow-lg shadow-emerald-600/15 transition-all text-[10px]"
                            >
                                <CreditCard className="w-4 h-4 mb-0.5" />
                                بطاقة
                            </button>
                        </div>

                        <button
                            className="w-full mt-2 h-10 border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 hover:text-emerald-600 hover:border-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
                        >
                            <Receipt className="w-4 h-4" />
                            إصدار فاتورة
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );

    async function handleCheckout(method: string) {
        if (items.length === 0) return;

        try {
            const orderPayload = {
                items: items.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity
                })),
                status: 'pending',
                table_number: 'POS',
            };

            console.log('Order Payload:', JSON.stringify(orderPayload, null, 2));
            const order = await orderService.createOrder(orderPayload);
            console.log('Order Response:', order);

            // If payment record is needed
            // await paymentService.recordPayment({
            //     order_id: order.id,
            //     amount: total,
            //     payment_method: method
            // });

            alert('تم إتمام الطلب بنجاح!');
            clearCart();
            router.push('/orders');
        } catch (err: any) {
            console.error('Checkout failed', err);
            if (err.response?.data) {
                console.error('Server error details:', err.response.data);
            }
            alert('حدث خطأ أثناء إتمام الطلب');
        }
    }
}
