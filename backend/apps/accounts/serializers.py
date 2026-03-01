"""
Account serializers.

RegisterSerializer  — new user registration with validation
MeSerializer        — authenticated user profile read / partial update
"""
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """Validates and creates a new user. Password is write-only."""
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ["email", "last_name", "first_name", "password", "password_confirm"]

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールアドレスは既に使用されています。")
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "パスワードが一致しません。"})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(**validated_data)


class MeSerializer(serializers.ModelSerializer):
    """Read / update the authenticated user's own profile.

    Password is excluded — use a dedicated password-change endpoint if needed.
    """
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "last_name",
            "first_name",
            "birthday",
            "sex",
            "profile_picture",
            "created_at",
        ]
        read_only_fields = ["id", "email", "created_at"]
