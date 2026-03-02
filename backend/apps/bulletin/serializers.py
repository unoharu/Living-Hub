"""
Bulletin board serializer: Article.
"""
from rest_framework import serializers

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    """Read + Create articles. Author is injected from request on creation."""
    author_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "author_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author_name", "created_at", "updated_at"]

    def get_author_name(self, obj: Article) -> str:
        return f"{obj.author.last_name} {obj.author.first_name}"

    def create(self, validated_data: dict) -> Article:
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
