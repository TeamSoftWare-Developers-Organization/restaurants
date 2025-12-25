import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();

    // Initialize store from local storage if not already done
    if (!userStore.user && import.meta.client) {
        userStore.initializeStore();
    }

    // If user is not authenticated and trying to access a page other than login, redirect to login
    if (!userStore.isAuthenticated && to.path !== '/login') {
        return navigateTo('/login');
    }

    // If user is authenticated and trying to access login, redirect to home
    if (userStore.isAuthenticated && to.path === '/login') {
        return navigateTo('/');
    }
});
