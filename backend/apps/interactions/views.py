"""
Interaction API views: favorites (toggle) and reviews (create).
"""
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.properties.models import Property
from .models import Favorite, Review
from .serializers import FavoriteSerializer, FavoriteToggleSerializer, ReviewSerializer


class FavoriteListView(ListAPIView):
    """GET /api/v1/interactions/favorites/

    Returns the authenticated user's favorited properties.
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Favorite.objects.filter(user=self.request.user)
            .select_related(
                "property__ward__city",
                "property__property_type",
            )
            .prefetch_related("property__units")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # All listed properties are already favorites, so pass the full set.
        context["favorite_ids"] = set(
            self.get_queryset().values_list("property_id", flat=True)
        )
        return context


class FavoriteToggleView(APIView):
    """POST /api/v1/interactions/favorites/

    Toggles the favorite status for the given property_id.
    Returns {"added": true/false, "property_id": <id>}.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = FavoriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property_id = serializer.validated_data["property_id"]
        property_obj = get_object_or_404(Property, pk=property_id)

        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            property=property_obj,
        )
        if not created:
            favorite.delete()

        return Response(
            {"added": created, "property_id": property_id},
            status=status.HTTP_200_OK,
        )


class ReviewCreateView(CreateAPIView):
    """POST /api/v1/interactions/reviews/"""
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.none()
