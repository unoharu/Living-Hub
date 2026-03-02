"""
Shared pytest fixtures.

Imported automatically by pytest — no explicit import needed in test files.
"""
import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories import UserFactory


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def user(db):
    """An ordinary authenticated user (not staff)."""
    return UserFactory()


@pytest.fixture
def other_user(db):
    """A second user for testing isolation between users."""
    return UserFactory()


@pytest.fixture
def auth_client(user) -> APIClient:
    """APIClient pre-authenticated as `user` via JWT."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture
def other_auth_client(other_user) -> APIClient:
    """APIClient pre-authenticated as `other_user`."""
    client = APIClient()
    refresh = RefreshToken.for_user(other_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client
