# reservations/api.py

from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from orders.api import OrderOut # نحتاج لاستيراد مخطط OrderOut
from datetime import datetime, date

from .models import Table, Reservation
from orders.models import Order

# إنشاء موجه (Router) خاص بتطبيق reservations
reservations_router = Router(tags=["الطاولات والحجوزات"])

# 1. تعريف المخططات (Schemas) لـ Table

# سننشئ مخططين TableOut، أحدهما يعيد الطلب الحالي والآخر لا
class BaseTableOut(Schema):
    id: int
    table_number: str
    capacity: int
    status: str
    location: Optional[str] = None

class TableOut(BaseTableOut):
    current_order: Optional[OrderOut] = None # يتضمن الطلب الحالي

class TableIn(Schema):
    table_number: str
    capacity: int
    status: Optional[str] = 'available'
    location: Optional[str] = None
    current_order_id: Optional[int] = None # المفتاح الخارجي للطلب الحالي

# نقاط نهاية CRUD لـ Table (الطاولات)

@reservations_router.get("/tables/", response=List[TableOut])
def list_tables(request, status: Optional[str] = None):
    """
    جلب قائمة بجميع الطاولات مع خيار التصفية حسب الحالة.
    """
    tables = Table.objects.all()
    if status:
        tables = tables.filter(status=status)
    return tables

@reservations_router.post("/tables/", response=TableOut)
def create_table(request, table_data: TableIn):
    """
    إنشاء طاولة جديدة.
    """
    order = None
    if table_data.current_order_id:
        order = get_object_or_404(Order, id=table_data.current_order_id)
        
    table = Table.objects.create(
        table_number=table_data.table_number,
        capacity=table_data.capacity,
        status=table_data.status,
        location=table_data.location,
        current_order=order
    )
    return table

# 2. تعريف المخططات (Schemas) لـ Reservation

class ReservationIn(Schema):
    table_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    reservation_time: datetime
    number_of_guests: int
    status: Optional[str] = 'pending'
    notes: Optional[str] = None

class ReservationOut(Schema):
    id: int
    table: Optional[BaseTableOut] = None
    customer_name: str
    customer_phone: str
    reservation_time: datetime
    number_of_guests: int
    status: str
    notes: Optional[str] = None

# نقاط نهاية CRUD لـ Reservation (الحجوزات)

@reservations_router.get("/reservations/", response=List[ReservationOut])
def list_reservations(request, for_date: Optional[date] = None):
    """
    جلب قائمة بجميع الحجوزات مع خيار التصفية حسب التاريخ.
    """
    reservations = Reservation.objects.all()
    if for_date:
        reservations = reservations.filter(reservation_time__date=for_date)
    return reservations

@reservations_router.post("/reservations/", response=ReservationOut)
def create_reservation(request, reservation_data: ReservationIn):
    """
    إنشاء حجز جديد.
    """
    table = None
    if reservation_data.table_id:
        table = get_object_or_404(Table, id=reservation_data.table_id)

    reservation = Reservation.objects.create(
        table=table,
        customer_name=reservation_data.customer_name,
        customer_phone=reservation_data.customer_phone,
        reservation_time=reservation_data.reservation_time,
        number_of_guests=reservation_data.number_of_guests,
        status=reservation_data.status,
        notes=reservation_data.notes
    )
    return reservation