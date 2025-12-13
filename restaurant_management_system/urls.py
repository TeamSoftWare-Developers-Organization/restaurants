# restaurant_management_system/urls.py

from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
# استيراد الـ routers من تطبيقاتنا
from employees.api import employee_router
# ... (سنستورد الموجهات الأخرى هنا لاحقاً)
#      إنشاء كائن NinjaAPI
api = NinjaAPI(title="Restaurant Management System API",
    description="API للتعامل مع نظام إدارة المطاعم",
    version="1.0.0",)

# سنضيف هنا مسارات الـ APIs لكل تطبيق
# مثال:
# @api.get("/hello")
# def hello(request):
#     return {"message": "Hello from Django Ninja!"}
# تسجيل الموجهات مع كائن الـ API الرئيسي
api.add_router("/employees/", employee_router)
# ... (سنضيف الموجهات الأخرى هنا لاحقاً)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls), # هذا هو المسار الذي سيستضيف جميع واجهات برمجة التطبيقات الخاصة بك
]