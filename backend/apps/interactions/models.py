"""
Interaction models: Favorite (お気に入り) and Review (レビュー).
Both are scoped to Property (building level), not Unit.
"""
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Favorite(models.Model):
    """User favorites a Property (building). One record per user-property pair."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favorites"
        verbose_name = "お気に入り"
        verbose_name_plural = "お気に入り"
        unique_together = [["user", "property"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} → {self.property}"


class Review(models.Model):
    """User review for a Property with a 1–5 star rating."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=1000)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reviews"
        verbose_name = "レビュー"
        verbose_name_plural = "レビュー"
        # One review per user per property
        unique_together = [["user", "property"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} ★{self.rating} {self.property}"
