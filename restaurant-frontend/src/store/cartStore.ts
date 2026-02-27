import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. تعريف هيكل الصنف في السلة
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// 2. تعريف هيكل المخزن (Store) والعمليات الحسابية
interface CartState {
    items: CartItem[];

    // العمليات (Actions)
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;

    // الحسابات (Computed Values)
    getTotals: () => {
        subtotal: number;
        taxAmount: number;
        total: number;
    };
}

// 3. إنشاء المخزن مع ميزة الحفظ التلقائي (Persistence)
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            // إضافة صنف أو زيادة الكمية إذا كان موجوداً
            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...product, quantity: 1 }] });
                }
            },

            // حذف صنف بالكامل
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            // تحديث الكمية يدوياً
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            // محرك العمليات الحسابية الخوارزمي
            getTotals: () => {
                const items = get().items;
                const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                const taxAmount = 0; // تم إلغاء الضريبة نهائياً
                const total = subtotal;

                return {
                    subtotal: Number(subtotal.toFixed(2)),
                    taxAmount: 0,
                    total: Number(total.toFixed(2)),
                };
            },
        }),
        {
            name: 'restaurant-cart-storage', // اسم المفتاح في LocalStorage
        }
    )
);
