"""
Property API views.

All endpoints are public (read-only). Authenticated users get `is_favorite`
populated without extra queries via the `favorite_ids` context injection.
"""
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

from apps.interactions.models import Favorite
from .filters import PropertyFilter
from .models import Property, Unit
from .serializers import PropertyDetailSerializer, PropertyListSerializer, UnitSerializer


class PropertyListView(ListAPIView):
    """GET /api/v1/properties/"""
    serializer_class = PropertyListSerializer
    permission_classes = [AllowAny]
    filterset_class = PropertyFilter
    ordering_fields = ["walk_minute", "year_built"]

    def get_queryset(self):
        return (
            Property.objects.select_related("ward__city", "property_type")
            .prefetch_related("units")
            .order_by("-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        if user.is_authenticated:
            context["favorite_ids"] = set(
                Favorite.objects.filter(user=user).values_list("property_id", flat=True)
            )
        return context


class PropertyDetailView(RetrieveAPIView):
    """GET /api/v1/properties/{id}/"""
    serializer_class = PropertyDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Property.objects.select_related("ward__city", "property_type")
            .prefetch_related("images", "units__images", "units__amenities__category")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        if user.is_authenticated:
            context["favorite_ids"] = set(
                Favorite.objects.filter(user=user).values_list("property_id", flat=True)
            )
        return context


class PropertyUnitListView(ListAPIView):
    """GET /api/v1/properties/{property_id}/units/"""
    serializer_class = UnitSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Unit.objects.filter(property_id=self.kwargs["property_id"])
            .prefetch_related("images", "amenities__category")
        )


class UnitDetailView(RetrieveAPIView):
    """GET /api/v1/properties/units/{id}/"""
    serializer_class = UnitSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Unit.objects.prefetch_related("images", "amenities__category")
