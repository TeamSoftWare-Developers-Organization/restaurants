# payments/api.py

from ninja import Router, Schema
from typing import List, Optional
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.db.models import Sum

from .models import Payment
from orders.models import Order
from orders.api import OrderOut # نحتاج لاستيراد مخطط OrderOut
from employees.models import Employee

# إنشاء موجه (Router) خاص بتطبيق payments
payments_router = Router(tags=["المدفوعات"])

# 1. تعريف المخططات (Schemas) لـ Payment

class PaymentIn(Schema):
    order_id: int
    amount: float
    payment_method: str
    transaction_id: Optional[str] = None

class PaymentOut(Schema):
    id: int
    order_id: int # يمكن عرض الـ ID فقط أو تضمين OrderOut بالكامل
    payment_date_time: datetime
    amount: float
    payment_method: str
    transaction_id: Optional[str] = None

# نقاط نهاية CRUD لـ Payment (المدفوعات)

@payments_router.get("/", response=List[PaymentOut])
def list_payments(request):
    """
    جلب قائمة بجميع المدفوعات المسجلة.
    """
    return Payment.objects.all()

@payments_router.post("/", response=PaymentOut)
def record_payment(request, payment_data: PaymentIn):
    """
    تسجيل دفعة جديدة لطلب معين.
    """
    order = get_object_or_404(Order, id=payment_data.order_id)
    
    # يمكن إضافة منطق للتحقق من أن المبلغ لا يتجاوز الإجمالي المستحق
    
    payment = Payment.objects.create(
        order=order,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        transaction_id=payment_data.transaction_id
    )
    
    # بعد الدفع، نتحقق مما إذا كان الطلب قد تم دفعه بالكامل
    total_paid = Payment.objects.filter(order=order).aggregate(Sum('amount'))['amount__sum'] or 0
    if total_paid >= order.total_amount:
        order.status = 'paid'
        order.save()
        
    return payment