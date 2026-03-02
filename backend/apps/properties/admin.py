from django.contrib import admin

from .models import (
    Amenity,
    AmenityCategory,
    City,
    Property,
    PropertyImage,
    PropertyType,
    Unit,
    UnitAmenity,
    UnitImage,
    Ward,
)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ("city", "name")
    list_filter = ("city",)
    search_fields = ("name",)


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(AmenityCategory)
class AmenityCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name",)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ("image", "order")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "property_name", "ward", "property_type", "station",
        "walk_minute", "year_built",
    )
    list_filter = ("property_type", "ward__city")
    search_fields = ("property_name", "address", "station")
    inlines = [PropertyImageInline]


class UnitAmenityInline(admin.TabularInline):
    model = UnitAmenity
    extra = 1


class UnitImageInline(admin.TabularInline):
    model = UnitImage
    extra = 1
    fields = ("image", "order")


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = (
        "property", "room_number", "floor", "layout", "rent",
        "availability", "has_3d_model",
    )
    list_filter = ("availability", "has_3d_model", "pet_allowed", "parking")
    search_fields = ("property__property_name", "room_number")
    inlines = [UnitAmenityInline, UnitImageInline]
    fieldsets = (
        (None, {
            "fields": ("property", "room_number", "floor", "layout", "layout_image"),
        }),
        ("賃料", {
            "fields": ("rent", "management_fee", "deposit_months", "key_money_months"),
        }),
        ("条件", {
            "fields": ("credit_card_ok", "parking", "pet_allowed", "position"),
        }),
        ("ステータス", {
            "fields": ("availability", "has_3d_model", "tour_url"),
        }),
        ("その他", {
            "fields": ("area", "remarks"),
        }),
    )
