# employees/models.py

from django.db import models
from django.contrib.auth.models import User # استيراد موديل المستخدم المدمج

class Employee(models.Model):
    # استخدام موديل المستخدم المدمج للتعامل مع المصادقة (username, password, email)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile') 
    
    # الدور: نادل، طاهٍ، مدير، كاشير
    ROLE_CHOICES = [
        ('waiter', 'نادل'),
        ('chef', 'طاهٍ'),
        ('manager', 'مدير'),
        ('cashier', 'كاشير'),
        ('other', 'أخرى'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='waiter')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    hire_date = models.DateField(auto_now_add=True)

    # ... (باقي كود الموديل)
    # لاحظ أننا أزلنا first_name, last_name, username, password حيث أصبحت الآن في User

    class Meta:
        verbose_name = "موظف"
        verbose_name_plural = "موظفون"

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"