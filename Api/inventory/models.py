from django.db import models
from menu.models import MenuItem # استيراد موديل صنف القائمة

class Ingredient(models.Model):
    # ingredient_id (مفتاح أساسي) يتم إنشاؤه تلقائياً بواسطة Django كـ 'id'
    name = models.CharField(max_length=100, unique=True) # اسم المكون (مثال: طماطم، دقيق، دجاج)
    current_stock = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # الكمية المتوفرة حالياً
    
    # وحدة القياس: كجم، لتر، قطعة، علبة، إلخ.
    UNIT_CHOICES = [
        ('kg', 'كيلوجرام'),
        ('liter', 'لتر'),
        ('pcs', 'قطعة/وحدة'),
        ('box', 'علبة'),
        ('g', 'جرام'),
        ('ml', 'مليلتر'),
    ]
    unit_of_measure = models.CharField(max_length=10, choices=UNIT_CHOICES, default='pcs')
    
    reorder_level = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # المستوى الذي عنده يجب إعادة الطلب

    class Meta:
        verbose_name = "مكون"
        verbose_name_plural = "المخزون (المكونات)"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.current_stock} {self.get_unit_of_measure_display()})"

class RecipeIngredient(models.Model):
    # لا يوجد مفتاح أساسي خاص، المفتاح الأساسي هو مركب من item و ingredient
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='recipe_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='recipes_using_this')
    quantity_needed = models.DecimalField(max_digits=10, decimal_places=2) # كمية المكون اللازمة لهذا الصنف

    class Meta:
        verbose_name = "مكون وصفة"
        verbose_name_plural = "مكونات الوصفات"
        # ضمان أن كل زوج (صنف، مكون) فريد، أي لا يمكن لنفس الصنف أن يتطلب نفس المكون مرتين في الوصفة
        unique_together = ('menu_item', 'ingredient')

    def __str__(self):
        return f"{self.menu_item.name} يتطلب {self.quantity_needed} {self.ingredient.get_unit_of_measure_display()} من {self.ingredient.name}"