"""
Tests for accounts API: register, login, me.
"""
import pytest
from django.urls import reverse

from tests.factories import UserFactory


@pytest.mark.django_db
class TestRegister:
    url = reverse("account-register")

    def test_success_returns_tokens_and_user(self, api_client):
        payload = {
            "email": "new@example.com",
            "last_name": "山田",
            "first_name": "花子",
            "password": "securePass123",
            "password_confirm": "securePass123",
        }
        response = api_client.post(self.url, payload, format="json")

        assert response.status_code == 201
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == "new@example.com"

    def test_duplicate_email_returns_400(self, api_client, db):
        UserFactory(email="existing@example.com")
        payload = {
            "email": "existing@example.com",
            "last_name": "鈴木",
            "first_name": "一郎",
            "password": "securePass123",
            "password_confirm": "securePass123",
        }
        response = api_client.post(self.url, payload, format="json")
        assert response.status_code == 400

    def test_password_mismatch_returns_400(self, api_client, db):
        payload = {
            "email": "mismatch@example.com",
            "last_name": "佐藤",
            "first_name": "二郎",
            "password": "securePass123",
            "password_confirm": "differentPass456",
        }
        response = api_client.post(self.url, payload, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestLogin:
    url = reverse("account-login")

    def test_valid_credentials_return_tokens(self, api_client, user):
        response = api_client.post(
            self.url,
            {"email": user.email, "password": "password123"},
            format="json",
        )
        assert response.status_code == 200
        assert "access" in response.data

    def test_wrong_password_returns_401(self, api_client, user):
        response = api_client.post(
            self.url,
            {"email": user.email, "password": "wrongpassword"},
            format="json",
        )
        assert response.status_code == 401


@pytest.mark.django_db
class TestMe:
    url = reverse("account-me")

    def test_unauthenticated_returns_401(self, api_client):
        response = api_client.get(self.url)
        assert response.status_code == 401

    def test_authenticated_returns_own_profile(self, auth_client, user):
        response = auth_client.get(self.url)
        assert response.status_code == 200
        assert response.data["email"] == user.email

    def test_patch_updates_name(self, auth_client, user):
        response = auth_client.patch(
            self.url,
            {"first_name": "更新済"},
            format="json",
        )
        assert response.status_code == 200
        assert response.data["first_name"] == "更新済"

    def test_put_not_allowed(self, auth_client, user):
        response = auth_client.put(
            self.url,
            {"email": user.email, "last_name": "X", "first_name": "Y"},
            format="json",
        )
        assert response.status_code == 405
