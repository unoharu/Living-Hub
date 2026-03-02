from django.contrib import admin

from .models import ViewingRequest


@admin.register(ViewingRequest)
class ViewingRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "unit", "preferred_date", "status", "created_at")
    list_filter = ("status", "preferred_date")
    search_fields = ("user__email", "unit__property__property_name")
    raw_id_fields = ("user", "unit")
    readonly_fields = ("created_at", "updated_at")
