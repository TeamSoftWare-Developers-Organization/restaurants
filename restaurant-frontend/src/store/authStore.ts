import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            login: async (email: string, password?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login/', { email, password });
                    const { access } = response.data;

                    set({ token: access, isLoggedIn: true });

                    // Fetch user info with the new token
                    const userResponse = await api.get('/auth/me/');
                    const profile = userResponse.data.employee_profile;

                    set({
                        user: {
                            id: profile.id,
                            email: profile.user.email,
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            role: profile.role
                        },
                        isLoading: false
                    });
                    return true;
                } catch (err: any) {
                    set({
                        isLoading: false,
                        error: err.response?.data?.message || 'فشل تسجيل الدخول'
                    });
                    return false;
                }
            },
            logout: () => set({ user: null, token: null, isLoggedIn: false, error: null }),
            checkAuth: async () => {
                try {
                    const response = await api.get('/auth/me/');
                    const profile = response.data.employee_profile;
                    set({
                        user: {
                            id: profile.id,
                            email: profile.user.email,
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            role: profile.role
                        },
                        isLoggedIn: true
                    });
                } catch (err) {
                    set({ user: null, token: null, isLoggedIn: false });
                }
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
