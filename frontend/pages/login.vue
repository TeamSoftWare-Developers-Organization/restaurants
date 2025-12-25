<template>
  <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50 p-8 sm:p-10 transform transition-all duration-300 hover:shadow-2xl">
    <div class="mb-10 text-center">
      <!-- You could add a logo here if available -->
      <!-- <img src="/logo.png" alt="Restaurant Logo" class="mx-auto h-16 w-auto mb-4" /> -->
      <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">مرحباً بعودتك</h1>
      <p class="mt-2 text-sm text-gray-600">يرجى تسجيل الدخول للمتابعة</p>
    </div>

    <div v-if="error" class="mb-6 bg-red-50 border-r-4 border-red-500 p-4 rounded-md animate-pulse">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="mr-3">
          <p class="text-sm text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="username" 
            type="text" 
            id="username" 
            required
            class="block w-full pr-10 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 sm:text-sm bg-gray-50/50 hover:bg-white"
            placeholder="أدخل اسم المستخدم"
          >
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            required
            class="block w-full pr-10 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 sm:text-sm bg-gray-50/50 hover:bg-white"
            placeholder="••••••••"
          >
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer">
          <label for="remember-me" class="mr-2 block text-sm text-gray-600 cursor-pointer">تذكرني</label>
        </div>
        <!-- Optional: Add Forgot Password link later -->
        <!-- <div class="text-sm">
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">نسيت كلمة المرور؟</a>
        </div> -->
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30"
      >
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <svg v-if="!loading" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// تعيين التخطيط (Layout) لصفحة تسجيل الدخول
definePageMeta({
  layout: 'login'
});

const runtimeConfig = useRuntimeConfig();
const API_URL = runtimeConfig.public.apiBase;
const userStore = useUserStore();

// بيانات النموذج
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

// دالة معالجة تسجيل الدخول
const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    // استخدم $fetch من Nuxt 3 لإرسال الطلب
    const response = await $fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      },
      // هام: السماح للكوكيز (Session ID) بالمرور بين النطاقات
      credentials: 'include' 
    });

    // إذا نجح التسجيل، نحفظ بيانات المستخدم وننتقل إلى لوحة التحكم
    if (response && response.is_authenticated) {
        // حفظ بيانات المستخدم في المتجر (Pinia)
        userStore.setUser(response.employee_profile);
        
        // التوجيه إلى الصفحة الرئيسية/التحكم
        await navigateTo('/'); 
    } else {
        error.value = 'استجابة غير متوقعة من الخادم.';
    }
    
  } catch (err) {
    // معالجة أخطاء الـ API (مثل 401 Unauthorized)
    if (err.response && err.response.status === 401) {
        error.value = err.response._data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة.';
    } else {
        error.value = 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.';
        console.error("Login Error:", err);
    }
  } finally {
    loading.value = false;
  }
};
</script>