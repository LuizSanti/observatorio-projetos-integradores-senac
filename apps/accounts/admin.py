from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Perfil", {"fields": ("perfil",)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Perfil", {"fields": ("perfil",)}),
    )

    list_display = ("username", "email", "perfil", "is_staff")