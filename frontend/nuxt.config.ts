// https://nuxt.com/docs/api/configuration/nuxt-config
// نستخدم متغيرات البيئة للوصول إلى عنوان الـ API
 
export default defineNuxtConfig({
  // تفعيل الاتصال عبر الـ API لجميع الطلبات
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_BASE_URL,
    }
    
  },
  modules: ['@pinia/nuxt'],
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
