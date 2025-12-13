from datetime import date
from ninja import Router, Schema
from typing import List, Optional  # pyright: ignore[reportDeprecated]
from django.db import IntegrityError # Added import
from pydantic import ConfigDict, field_serializer 
from .models import Employee
# removed unused APIRouter import to avoid confusion if not needed, or keep if other parts use it (user had `router = APIRouter()`)
from fastapi import APIRouter 

# إنشاء موجه (Router) خاص بتطبيق employees
employee_router = Router(tags=["الموظفون"])
router = APIRouter() # Keeping this as it was in the file, though unused in valid code

# 1. تعريف المخططات (Schemas) لمدخلات ومخرجات البيانات
class EmployeeIn(Schema):
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str] = None  # pyright: ignore[reportDeprecated]
    username: str
    password: str

class EmployeeOut(Schema):
    id: int
    first_name: str
    last_name: str
    role: str
    phone_number: Optional[str] = None  # pyright: ignore[reportDeprecated]
    hire_date: date
    username: str
    model_config = ConfigDict(from_attributes=True)  # pyright: ignore[reportUnannotatedClassAttribute]

    @field_serializer('hire_date')
    def serialize_hire_date(self, value: date) -> str:
        return value.strftime('%Y-%m-%d')

# 2. تعريف نقاط نهاية API

@employee_router.get("/", response=List[EmployeeOut])  # pyright: ignore[reportDeprecated]
def list_employees(request):  # pyright: ignore[reportUnknownParameterType, reportMissingParameterType, reportUnusedParameter]
    """
    جلب قائمة بجميع الموظفين.
    """
    employees = Employee.objects.all()
    return employees

@employee_router.post("/", response={201: dict, 400: dict, 500: dict}) # Updated return type
def create_employee(request, employee_data: EmployeeIn):  # pyright: ignore[reportUnknownParameterType]
    """
    إنشاء موظف جديد.
    """
    # التحقق مسبقاً من وجود اسم المستخدم
    if Employee.objects.filter(username=employee_data.username).exists():
        return 400, {"error": "The username already exists, choose another one."}

    try:
        employee = Employee.objects.create( # Used .create instead of .create_user
            first_name=employee_data.first_name,
            last_name=employee_data.last_name,
            role=employee_data.role,
            phone_number=employee_data.phone_number,
            username=employee_data.username,
            password=employee_data.password,
        )
        return 201, {"id": employee.id, "message": "Employee created successfully"}  # pyright: ignore[reportUnknownVariableType, reportUnknownMemberType, reportAttributeAccessIssue]
    except IntegrityError:
        return 400, {"error": "Failed to create employee due to data integrity issues"}
    except Exception as e:
        return 500, {"error": str(e)}

@router.get("/health")
async def health():
    return {"status": "ok"}