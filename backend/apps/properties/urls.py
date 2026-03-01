"""Properties URL configuration."""
from django.urls import path

from .views import PropertyDetailView, PropertyListView, PropertyUnitListView, UnitDetailView

urlpatterns = [
    path("", PropertyListView.as_view(), name="property-list"),
    path("<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path("<int:property_id>/units/", PropertyUnitListView.as_view(), name="property-unit-list"),
    path("units/<int:pk>/", UnitDetailView.as_view(), name="unit-detail"),
]
