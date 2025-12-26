# inventory/api.py

from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from .models import Ingredient, RecipeIngredient
from menu.models import MenuItem
from menu.api import MenuItemOut # استيراد مخطط MenuItemOut

# إنشاء موجه (Router) خاص بتطبيق inventory
inventory_router = Router(tags=["المخزون والوصفات"])

# 1. تعريف المخططات (Schemas) لـ Ingredient

class IngredientIn(Schema):
    name: str
    current_stock: float
    unit_of_measure: str
    reorder_level: float = 0.00

class IngredientOut(Schema):
    id: int
    name: str
    current_stock: float
    unit_of_measure: str
    reorder_level: float

# نقاط نهاية CRUD لـ Ingredient (المكونات)

@inventory_router.get("/ingredients/", response=List[IngredientOut])
def list_ingredients(request):
    """
    جلب قائمة بجميع المكونات في المخزون.
    """
    return Ingredient.objects.all()

@inventory_router.post("/ingredients/", response=IngredientOut)
def create_ingredient(request, ingredient_data: IngredientIn):
    """
    إنشاء مكون جديد في المخزون.
    """
    try:
        ingredient = Ingredient.objects.create(**ingredient_data.dict())
        return ingredient
    except IntegrityError:
        return 400, {"message": "المكون موجود بالفعل."}


# 2. تعريف المخططات (Schemas) لـ RecipeIngredient (الوصفات)

class RecipeIngredientIn(Schema):
    ingredient_id: int
    quantity_needed: float

class RecipeIngredientOut(Schema):
    id: int
    menu_item: MenuItemOut
    ingredient: IngredientOut
    quantity_needed: float

# نقاط نهاية للتعامل مع RecipeIngredient (إدارة الوصفات)

@inventory_router.get("/recipes/{menu_item_id}/", response=List[RecipeIngredientOut])
def get_recipe_for_item(request, menu_item_id: int):
    """
    جلب وصفة صنف قائمة محدد.
    """
    menu_item = get_object_or_404(MenuItem, id=menu_item_id)
    return RecipeIngredient.objects.filter(menu_item=menu_item)

@inventory_router.post("/recipes/{menu_item_id}/", response=RecipeIngredientOut)
def add_ingredient_to_recipe(request, menu_item_id: int, recipe_data: RecipeIngredientIn):
    """
    إضافة مكون إلى وصفة صنف قائمة.
    """
    menu_item = get_object_or_404(MenuItem, id=menu_item_id)
    ingredient = get_object_or_404(Ingredient, id=recipe_data.ingredient_id)

    # التحقق من عدم وجود السجل مسبقاً (Unique_together)
    try:
        recipe_item = RecipeIngredient.objects.create(
            menu_item=menu_item,
            ingredient=ingredient,
            quantity_needed=recipe_data.quantity_needed
        )
        return recipe_item
    except IntegrityError:
        return 400, {"message": "هذا المكون موجود بالفعل في وصفة هذا الصنف. استخدم PUT للتحديث."}

@inventory_router.put("/recipe_items/{recipe_ingredient_id}/", response=RecipeIngredientOut)
def update_recipe_ingredient(request, recipe_ingredient_id: int, recipe_data: RecipeIngredientIn):
    """
    تحديث كمية مكون في وصفة موجودة.
    """
    recipe_item = get_object_or_404(RecipeIngredient, id=recipe_ingredient_id)
    
    # يمكن السماح بتغيير المكون نفسه أو الكمية فقط
    recipe_item.quantity_needed = recipe_data.quantity_needed
    
    # إذا تم تمرير ingredient_id، نقوم بتحديث المكون المرتبط
    if recipe_data.ingredient_id is not None:
        recipe_item.ingredient = get_object_or_404(Ingredient, id=recipe_data.ingredient_id)
        
    recipe_item.save()
    return recipe_item