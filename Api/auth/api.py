# auth/api.py

from ninja import Router, Schema
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from employees.models import Employee 
from employees.api import EmployeeOut # نحتاج إلى المخطط لتفاصيل الموظف
from django.http import HttpRequest
from django.db import IntegrityError # لمعالجة أخطاء تكرار المستخدم
from django.contrib.auth.models import User

auth_router = Router(tags=["المصادقة والأمان"])

# 1. المخططات (Schemas)

class LoginIn(Schema):
    username: str
    password: str

class AuthOut(Schema):
    session_id: str
    is_authenticated: bool
    employee_profile: EmployeeOut

class RegisterIn(Schema):
    username: str
    password: str
    first_name: str
    last_name: str
    role: str # 'manager', 'waiter', 'chef', 'cashier'

# 2. نقاط نهاية API

@auth_router.post("/login/", response={200: AuthOut, 401: dict})
def user_login(request: HttpRequest, data: LoginIn):
    """
    تسجيل دخول الموظف وإنشاء جلسة عمل.
    """
    user = authenticate(request, username=data.username, password=data.password)

    if user is not None:
        login(request, user)
        
        # Force session creation if it doesn't exist
        if not request.session.session_key:
            request.session.save()
        
        try:
            employee_profile = Employee.objects.select_related('user').get(user=user)
        except Employee.DoesNotExist:
            return 401, {"message": "فشل تسجيل الدخول. لا يوجد ملف موظف مرتبط."}

        return {
            "session_id": request.session.session_key, 
            "is_authenticated": True,
            "employee_profile": employee_profile
        }
    else:
        return 401, {"message": "فشل تسجيل الدخول. اسم المستخدم أو كلمة المرور غير صحيحة."}

@auth_router.post("/logout/", response={200: dict})
def user_logout(request: HttpRequest):
    """
    تسجيل خروج المستخدم وإلغاء جلسة العمل.
    """
    logout(request)
    return {"success": True, "message": "تم تسجيل الخروج بنجاح."}

# نقطة نهاية لإنشاء موظف جديد (يمكن استخدامها من قبل المدير فقط)
# *يتطلب هذا استخدام موديل User المدمج لإنشاء المستخدم*
@auth_router.post("/register/", response={200: EmployeeOut, 400: dict})
def register_employee(request: HttpRequest, data: RegisterIn):
    """
    تسجيل موظف جديد (يجب أن يتم بواسطة مدير).
    """
    # يجب إضافة منطق التحقق من أن المستخدم الحالي هو مدير! (لم يتم إضافته بعد)
    try:
        # 1. إنشاء كائن المستخدم في جدول auth_user
        user = User.objects.create_user(
            username=data.username, 
            password=data.password, 
            first_name=data.first_name, 
            last_name=data.last_name
        )
        
        # 2. إنشاء كائن الموظف المرتبط في جدول employees_employee
        employee = Employee.objects.create(
            user=user,
            role=data.role,
        )
        return employee
    except IntegrityError:
        return 400, {"message": "اسم المستخدم موجود بالفعل."}
    except Exception as e:
        return 400, {"message": str(e)}
