import { defineStore } from 'pinia'

interface UserProfile {
  role: string;
  [key: string]: any;
}

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null, // سيحمل بيانات ملف الموظف (employee_profile)
    isAuthenticated: false,
    role: null, // دور الموظف (manager, waiter, chef, cashier)
  }),

  // الدوال التي تغير الحالة
  actions: {
    setUser(profile: UserProfile | null) {
      this.user = profile;
      this.isAuthenticated = !!profile;
      this.role = profile ? profile.role : null;

      // حفظ الجلسة في التخزين المحلي لاستمرارها عند تحديث الصفحة
      if (profile) {
        localStorage.setItem('user_profile', JSON.stringify(profile));
      } else {
        localStorage.removeItem('user_profile');
      }
    },

    // دالة للتحميل من التخزين المحلي عند تحديث الصفحة
    initializeStore() {
      if (typeof window !== 'undefined') {
        const profile = localStorage.getItem('user_profile');
        if (profile) {
          this.setUser(JSON.parse(profile));
        }
      }
    },

    // دالة لتسجيل الخروج
    async logout() {
      // يمكنك هنا استدعاء نقطة النهاية /api/auth/logout/ في Django
      // لإنهاء جلسة العمل على الخادم أيضاً.

      // لتبسيط الأمر الآن، سنعيد تعيين الحالة محلياً
      this.setUser(null);

      // التوجيه إلى صفحة تسجيل الدخول
      await navigateTo('/login');
    }
  },

  // دوال الاسترجاع (Getters)
  getters: {
    isManager: (state) => state.role === 'manager',
    isChef: (state) => state.role === 'chef',
    isCashier: (state) => state.role === 'cashier',
    isWaiter: (state) => state.role === 'waiter',
  }
})
