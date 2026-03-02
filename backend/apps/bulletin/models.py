"""Bulletin board model: Article (居住者掲示板の投稿)."""
from django.conf import settings
from django.db import models


class Article(models.Model):
    """A bulletin board post created by a registered user."""
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="articles",
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "articles"
        verbose_name = "掲示板投稿"
        verbose_name_plural = "掲示板投稿"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.author})"
