"""
Inquiry model: ViewingRequest (内見予約).

Web service boundary: we handle viewing appointment booking only.
Actual contract signing happens offline / in person.
"""
from django.conf import settings
from django.db import models


class ViewingRequest(models.Model):
    """A user's request to view a specific unit on a given date."""
    class Status(models.TextChoices):
        PENDING = "pending", "申請中"
        CONFIRMED = "confirmed", "確定"
        COMPLETED = "completed", "完了"
        CANCELLED = "cancelled", "キャンセル"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="viewing_requests",
    )
    unit = models.ForeignKey(
        "properties.Unit",
        on_delete=models.CASCADE,
        related_name="viewing_requests",
    )
    preferred_date = models.DateField(help_text="希望内見日")
    message = models.TextField(blank=True, help_text="管理会社へのメッセージ（任意）")
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "viewing_requests"
        verbose_name = "内見予約"
        verbose_name_plural = "内見予約"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} → {self.unit} ({self.preferred_date})"
