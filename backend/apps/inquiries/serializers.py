"""
Inquiry serializer: ViewingRequest creation and listing.
"""
from rest_framework import serializers

from .models import ViewingRequest


class ViewingRequestSerializer(serializers.ModelSerializer):
    """Create a viewing request. User is injected from the request context."""
    unit_room_number = serializers.CharField(source="unit.room_number", read_only=True)
    property_name = serializers.CharField(
        source="unit.property.property_name", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ViewingRequest
        fields = [
            "id",
            "unit",
            "unit_room_number",
            "property_name",
            "preferred_date",
            "message",
            "status",
            "status_display",
            "created_at",
        ]
        read_only_fields = ["id", "status", "status_display", "created_at"]

    def create(self, validated_data: dict) -> ViewingRequest:
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
