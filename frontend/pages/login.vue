<template>
  <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6 text-indigo-700">تسجيل دخول الموظف</h1>
    
    <p v-if="error" class="text-red-500 text-sm text-center mb-4">{{ error }}</p>

    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2">اسم المستخدم</label>
        <input 
          v-model="username" 
          type="text" 
          id="username" 
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">كلمة المرور</label>
        <input 
          v-model="password" 
          type="password" 
          id="password" 
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="flex items-center justify-between">
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full"
        >
          {{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}
        </button>
      </div>
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

<style>
/* يمكنك إضافة Tailwind CSS أو أي أنماط أخرى هنا لتحسين المظهر */
</style>