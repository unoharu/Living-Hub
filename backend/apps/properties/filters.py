"""
Property search filters.

Uses django-filter to support multi-value IN queries and range filters.
distinct=True prevents duplicates caused by M2M joins (amenities via units).
"""
from django_filters import rest_framework as filters
from django_filters import BaseInFilter, BooleanFilter, CharFilter, NumberFilter

from .models import Property


class PropertyFilter(filters.FilterSet):
    """Filter set for property list endpoint.

    Multi-value parameters accept comma-separated values (e.g. ward=1,2,3).
    """
    ward = BaseInFilter(field_name="ward_id", lookup_expr="in")
    property_type = BaseInFilter(field_name="property_type_id", lookup_expr="in")
    layout = BaseInFilter(field_name="units__layout", lookup_expr="in")
    min_rent = NumberFilter(field_name="units__rent", lookup_expr="gte")
    max_rent = NumberFilter(field_name="units__rent", lookup_expr="lte")
    walk_minute = NumberFilter(field_name="walk_minute", lookup_expr="lte")
    amenity = BaseInFilter(field_name="units__amenities__id", lookup_expr="in")
    pet_allowed = BooleanFilter(field_name="units__pet_allowed")
    parking = BooleanFilter(field_name="units__parking")
    availability = CharFilter(field_name="units__availability")

    class Meta:
        model = Property
        fields = [
            "ward",
            "property_type",
            "layout",
            "min_rent",
            "max_rent",
            "walk_minute",
            "amenity",
            "pet_allowed",
            "parking",
            "availability",
        ]

    @property
    def qs(self):
        # M2M / FK traversals cause duplicate rows — deduplicate at the DB level.
        return super().qs.distinct()
