<template>
  <div class="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
    <!-- Navbar -->
    <nav class="bg-indigo-600 shadow-lg text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="font-bold text-xl">نظام إدارة المطعم</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <NuxtLink to="/" class="px-3 py-2 rounded-md hover:bg-indigo-500">الرئيسية</NuxtLink>
            <!-- Add more links here -->
            <button @click="handleLogout" class="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const handleLogout = async () => {
  await userStore.logout();
};
</script>
