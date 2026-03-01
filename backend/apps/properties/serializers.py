"""
Property serializers.

Hierarchy:
  PropertyListSerializer  — lightweight for list pages
  PropertyDetailSerializer — full detail including nested images and units
  UnitSerializer           — full unit detail with amenities grouped by category
"""
from rest_framework import serializers

from apps.interactions.models import Favorite
from .models import Amenity, AmenityCategory, Property, PropertyImage, Unit, UnitImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "order"]


class AmenityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AmenityCategory
        fields = ["id", "name"]


class AmenitySerializer(serializers.ModelSerializer):
    category = AmenityCategorySerializer(read_only=True)

    class Meta:
        model = Amenity
        fields = ["id", "name", "category"]


class UnitImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitImage
        fields = ["id", "image", "order"]


class UnitSerializer(serializers.ModelSerializer):
    """Full unit detail. Amenities are grouped by category for easy frontend rendering."""
    images = UnitImageSerializer(many=True, read_only=True)
    amenities_by_category = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = [
            "id",
            "room_number",
            "floor",
            "layout",
            "layout_image",
            "area",
            "rent",
            "management_fee",
            "deposit_months",
            "key_money_months",
            "credit_card_ok",
            "parking",
            "pet_allowed",
            "position",
            "remarks",
            "tour_url",
            "has_3d_model",
            "availability",
            "images",
            "amenities_by_category",
        ]

    def get_amenities_by_category(self, unit: Unit) -> list[dict]:
        """Return amenities grouped by category: [{category, items: [...]}]."""
        # Single query: fetch all amenities with prefetched category data
        amenities = unit.amenities.select_related("category").all()

        grouped: dict[str, dict] = {}
        for amenity in amenities:
            cat_name = amenity.category.name
            if cat_name not in grouped:
                grouped[cat_name] = {
                    "category_id": amenity.category.id,
                    "category": cat_name,
                    "items": [],
                }
            grouped[cat_name]["items"].append({"id": amenity.id, "name": amenity.name})

        return list(grouped.values())


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for property list pages."""
    ward_name = serializers.CharField(source="ward.name", read_only=True)
    city_name = serializers.CharField(source="ward.city.name", read_only=True)
    property_type_name = serializers.CharField(source="property_type.name", read_only=True)
    # Lowest rent among available units; None if no units
    min_rent = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "property_name",
            "ward_name",
            "city_name",
            "station",
            "line",
            "walk_minute",
            "year_built",
            "cover_image",
            "property_type_name",
            "min_rent",
            "is_favorite",
        ]

    def get_min_rent(self, property: Property) -> int | None:
        # prefetch_related("units") is expected from the view queryset
        available = [u for u in property.units.all() if u.availability == "available"]
        if not available:
            return None
        return min(u.rent for u in available)

    def get_is_favorite(self, property: Property) -> bool:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        # Avoid N+1: the view should pass `favorite_ids` via context when possible
        favorite_ids: set[int] | None = self.context.get("favorite_ids")
        if favorite_ids is not None:
            return property.id in favorite_ids
        return Favorite.objects.filter(user=request.user, property=property).exists()


class PropertyDetailSerializer(PropertyListSerializer):
    """Full property detail including images and all units."""
    images = PropertyImageSerializer(many=True, read_only=True)
    units = UnitSerializer(many=True, read_only=True)

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "address",
            "phone_number",
            "images",
            "units",
        ]
