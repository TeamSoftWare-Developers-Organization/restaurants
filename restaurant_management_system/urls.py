# restaurant_management_system/urls.py

from django.contrib import admin
from django.urls import path 
from ninja import NinjaAPI 
# استيراد الـ routers من تطبيقاتنا
from employees.api import employee_router
from auth.api import auth_router
# from inventory.api import inventory_router
# from orders.api import orders_router
# from tables.api import tables_router
# from menu.api import menu_router
# from kitchen.api import kitchen_router
# from reports.api import reports_router
# from pos.api import pos_router
# إنشاء كائن NinjaAPI
api = NinjaAPI(title="Restaurant Management System API",
    description="API للتعامل مع نظام إدارة المطاعم",
    version="1.0.0",)

# Registering controllers/routers
api.add_router("/employees", employee_router)
api.add_router("/auth", auth_router)
# api.add_router("inventory/", inventory_router)
# api.add_router("orders/", orders_router)
# api.add_router("tables/", tables_router)
# api.add_router("menu/", menu_router)
# api.add_router("kitchen/", kitchen_router)
# api.add_router("reports/", reports_router)
# api.add_router("pos/", pos_router)

# مثال:
# @api.get("/hello")
# def hello(request):
#     return {"message": "Hello from Django Ninja!"}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls), # هذا هو المسار الذي سيستضيف جميع واجهات برمجة التطبيقات الخاصة بك
]