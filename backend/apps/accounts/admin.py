from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "last_name", "first_name", "is_staff", "is_active", "created_at")
    list_filter = ("is_staff", "is_active", "sex")
    search_fields = ("email", "last_name", "first_name")
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("個人情報", {"fields": ("last_name", "first_name", "birthday", "sex", "profile_picture")}),
        ("権限", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "last_name", "first_name", "password1", "password2"),
            },
        ),
    )
