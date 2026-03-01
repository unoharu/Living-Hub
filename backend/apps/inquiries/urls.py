"""Inquiries URL configuration."""
from django.urls import path

from .views import MyViewingRequestListView, ViewingRequestCreateView

urlpatterns = [
    path("", ViewingRequestCreateView.as_view(), name="inquiry-create"),
    path("mine/", MyViewingRequestListView.as_view(), name="inquiry-mine"),
]
