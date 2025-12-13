from django.db import models
from typing import TYPE_CHECKING
from typing_extensions import override  # أضف هذا الاستيراد

class Employee(models.Model):
    first_name = models.CharField(max_length=100)  # pyright: ignore[reportUnannotatedClassAttribute]
    last_name = models.CharField(max_length=100)  # pyright: ignore[reportUnannotatedClassAttribute]
    ROLE_CHOICES = [  # pyright: ignore[reportUnannotatedClassAttribute]
        ('waiter', 'نادل'),
        ('chef', 'طاهٍ'),
        ('manager', 'مدير'),
        ('cashier', 'كاشير'),
        ('other', 'أخرى'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='waiter')  # pyright: ignore[reportUnannotatedClassAttribute]
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # pyright: ignore[reportUnannotatedClassAttribute]
    hire_date = models.DateField(auto_now_add=True)  # pyright: ignore[reportUnannotatedClassAttribute]
    username = models.CharField(max_length=50, unique=True)  # pyright: ignore[reportUnannotatedClassAttribute]
    password = models.CharField(max_length=128)  # pyright: ignore[reportUnannotatedClassAttribute]

    class Meta:
        verbose_name: str = "موظف"        # أضف التصنيف النوعي
        verbose_name_plural: str = "موظفون"  # أضف التصنيف النوعي

    if TYPE_CHECKING:
        def get_role_display(self) -> str: ...

    @override  # أضف هذا الديكوراتور
    def __str__(self) -> str:  # أضف التصنيف النوعي للإرجاع
        return f"{self.first_name} {self.last_name} ({self.get_role_display()})"