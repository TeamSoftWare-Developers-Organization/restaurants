// https://nuxt.com/docs/api/configuration/nuxt-config
// نستخدم متغيرات البيئة للوصول إلى عنوان الـ API
const API_BASE_URL = import.meta.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
 
export default defineNuxtConfig({
  // تفعيل الاتصال عبر الـ API لجميع الطلبات
  runtimeConfig: {
    public: {
      apiBase: API_BASE_URL,
    }
  },
  
  // تفعيل دعم الـ Cookie والـ CORS أثناء التطوير
  devtools: { enabled: true },
  
  // إعدادات أخرى قد نحتاجها لاحقًا (مثل CSS و Plugins)
  css: [
    // يمكن إضافة ملفات CSS أو Sass هنا لاحقاً
  ],
})
function defineNuxtConfig<T extends {
  // تفعيل الاتصال عبر الـ API لجميع الطلبات
  runtimeConfig: { public: { apiBase: any } };
  // تفعيل دعم الـ Cookie والـ CORS أثناء التطوير
  devtools: { enabled: boolean };
  // إعدادات أخرى قد نحتاجها لاحقًا (مثل CSS و Plugins)
  css: never[];
}>(config: T): T {
  return config;
}
