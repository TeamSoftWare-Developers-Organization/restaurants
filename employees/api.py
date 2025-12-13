# employees/api.py

from ninja import Router, Schema
from typing import List, Optional
from .models import Employee

# إنشاء موجه (Router) خاص بتطبيق employees
employee_router = Router(tags=["الموظفون"])

# 1. تعريف المخططات (Schemas) لمدخلات ومخرجات البيانات
# Schema لإدخال بيانات موظف جديد (لا يشمل id، وتوقع كلمة مرور نصية)
class EmployeeIn(Schema):
    first_name: str
    last_name: str
    role: str # يمكنك إضافة تحقق هنا لضمان أنها من الخيارات المتاحة
    phone_number: Optional[str] = None # Optional تعني أنه يمكن أن يكون فارغاً
    username: str
    password: str # ستتم معالجتها لتشفيرها قبل الحفظ

# Schema لإخراج بيانات الموظف (يشمل id، ولا يعرض كلمة المرور)
class EmployeeOut(Schema):
    id: int # Django يضيف حقل 'id' تلقائياً كمفتاح أساسي
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str] = None
    hire_date: str # يمكن تحويله إلى str لسهولة العرض في API
    username: str

# 2. تعريف نقاط نهاية API

@employee_router.get("/", response=List[EmployeeOut])
def list_employees(request):
    """
    جلب قائمة بجميع الموظفين.
    """
    employees = Employee.objects.all()
    return employees

@employee_router.post("/", response=EmployeeOut)
def create_employee(request, employee_data: EmployeeIn):
    """
    إنشاء موظف جديد.
    """
    # هنا يجب أن تقوم بتشفير كلمة المرور قبل حفظها
    # For simplicity, we'll store it directly for now, but THIS IS NOT SECURE FOR PRODUCTION
    # Later, you should use Django's built-in password hashing:
    # from django.contrib.auth.hashers import make_password
    # hashed_password = make_password(employee_data.password)

    employee = Employee.objects.create(
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        role=employee_data.role,
        phone_number=employee_data.phone_number,
        username=employee_data.username,
        password=employee_data.password, # For development only, replace with hashed password!
    )
    return employee