from django.contrib import admin

from .models import Favorite, Review


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__email", "property__property_name")
    raw_id_fields = ("user", "property")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "rating", "title", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("user__email", "property__property_name", "title")
    raw_id_fields = ("user", "property")
