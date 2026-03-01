"""Bulletin URL configuration."""
from django.urls import path

from .views import ArticleCreateView, ArticleDetailView, ArticleListView

urlpatterns = [
    path("articles/", ArticleListView.as_view(), name="article-list"),
    path("articles/create/", ArticleCreateView.as_view(), name="article-create"),
    path("articles/<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
]
