"""
Interaction serializers: Favorite and Review.
"""
from rest_framework import serializers

from apps.properties.serializers import PropertyListSerializer
from .models import Favorite, Review


class FavoriteSerializer(serializers.ModelSerializer):
    """Read-only representation of a favorited property."""
    property = PropertyListSerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "property", "property_id", "created_at"]
        read_only_fields = ["id", "created_at"]


class FavoriteToggleSerializer(serializers.Serializer):
    """Input-only serializer for the toggle endpoint."""
    property_id = serializers.IntegerField()


class ReviewSerializer(serializers.ModelSerializer):
    """Create a review. User is injected from the request context."""
    author_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "property",
            "title",
            "content",
            "rating",
            "author_name",
            "created_at",
        ]
        read_only_fields = ["id", "author_name", "created_at"]

    def get_author_name(self, obj: Review) -> str:
        return f"{obj.user.last_name} {obj.user.first_name}"

    def validate(self, attrs: dict) -> dict:
        user = self.context["request"].user
        property_obj = attrs.get("property")
        if Review.objects.filter(user=user, property=property_obj).exists():
            raise serializers.ValidationError("この物件にはすでにレビューを投稿しています。")
        return attrs

    def create(self, validated_data: dict) -> Review:
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
