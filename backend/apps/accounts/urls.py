"""Accounts URL configuration."""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import MeView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="account-register"),
    path("login/", TokenObtainPairView.as_view(), name="account-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="account-token-refresh"),
    path("me/", MeView.as_view(), name="account-me"),
]
