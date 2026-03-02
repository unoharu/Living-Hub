"""Interactions URL configuration."""
from django.urls import path

from .views import FavoriteListView, FavoriteToggleView, ReviewCreateView

urlpatterns = [
    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
    path("favorites/toggle/", FavoriteToggleView.as_view(), name="favorite-toggle"),
    path("reviews/", ReviewCreateView.as_view(), name="review-create"),
]
