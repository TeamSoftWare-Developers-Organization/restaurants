from django.db import models
from orders.models import Order # استيراد موديل الطلب

class Payment(models.Model):
    # payment_id (مفتاح أساسي) يتم إنشاؤه تلقائياً بواسطة Django كـ 'id'
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments') # يربط الدفعة بالطلب
    
    payment_date_time = models.DateTimeField(auto_now_add=True) # تاريخ ووقت الدفع
    amount = models.DecimalField(max_digits=10, decimal_places=2) # المبلغ المدفوع
    
    # طريقة الدفع: نقدي، بطاقة ائتمان، محفظة إلكترونية
    METHOD_CHOICES = [
        ('cash', 'نقدي'),
        ('credit_card', 'بطاقة ائتمان'),
        ('online_wallet', 'محفظة إلكترونية'),
        ('other', 'أخرى'),
    ]
    payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='cash')
    
    transaction_id = models.CharField(max_length=100, blank=True, null=True, unique=True) # رقم المعاملة (إذا كان موجوداً)

    class Meta:
        verbose_name = "دفعة"
        verbose_name_plural = "مدفوعات"
        ordering = ['-payment_date_time']

    def __str__(self):
        return f"دفعة {self.amount}$ لطلب {self.order.id} بواسطة {self.get_payment_method_display()}"