"""
Tests for interactions API: favorite toggle and review creation.
"""
import pytest
from django.urls import reverse

from apps.interactions.models import Favorite, Review
from tests.factories import FavoriteFactory, PropertyFactory, ReviewFactory


@pytest.mark.django_db
class TestFavoriteList:
    url = reverse("favorite-list")

    def test_unauthenticated_returns_401(self, api_client):
        response = api_client.get(self.url)
        assert response.status_code == 401

    def test_returns_only_own_favorites(self, auth_client, user, other_user):
        prop_a = PropertyFactory()
        prop_b = PropertyFactory()
        FavoriteFactory(user=user, property=prop_a)
        FavoriteFactory(user=other_user, property=prop_b)

        response = auth_client.get(self.url)
        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["property"]["id"] == prop_a.id


@pytest.mark.django_db
class TestFavoriteToggle:
    url = reverse("favorite-toggle")

    def test_unauthenticated_returns_401(self, api_client):
        prop = PropertyFactory()
        response = api_client.post(self.url, {"property_id": prop.id}, format="json")
        assert response.status_code == 401

    def test_adds_favorite_when_not_existing(self, auth_client, user):
        prop = PropertyFactory()
        response = auth_client.post(self.url, {"property_id": prop.id}, format="json")
        assert response.status_code == 200
        assert response.data["added"] is True
        assert Favorite.objects.filter(user=user, property=prop).exists()

    def test_removes_favorite_when_already_existing(self, auth_client, user):
        prop = PropertyFactory()
        FavoriteFactory(user=user, property=prop)

        response = auth_client.post(self.url, {"property_id": prop.id}, format="json")
        assert response.status_code == 200
        assert response.data["added"] is False
        assert not Favorite.objects.filter(user=user, property=prop).exists()

    def test_invalid_property_id_returns_404(self, auth_client):
        response = auth_client.post(self.url, {"property_id": 99999}, format="json")
        assert response.status_code == 404


@pytest.mark.django_db
class TestReviewCreate:
    url = reverse("review-create")

    def test_unauthenticated_returns_401(self, api_client):
        prop = PropertyFactory()
        response = api_client.post(
            self.url,
            {"property": prop.id, "title": "良い", "content": "良かった", "rating": 5},
            format="json",
        )
        assert response.status_code == 401

    def test_creates_review_successfully(self, auth_client, user):
        prop = PropertyFactory()
        payload = {
            "property": prop.id,
            "title": "良い物件",
            "content": "駅近で快適でした。",
            "rating": 4,
        }
        response = auth_client.post(self.url, payload, format="json")
        assert response.status_code == 201
        assert Review.objects.filter(user=user, property=prop).exists()

    def test_duplicate_review_returns_400(self, auth_client, user):
        prop = PropertyFactory()
        ReviewFactory(user=user, property=prop)

        payload = {
            "property": prop.id,
            "title": "もう一度",
            "content": "重複してる",
            "rating": 3,
        }
        response = auth_client.post(self.url, payload, format="json")
        assert response.status_code == 400

    def test_invalid_rating_returns_400(self, auth_client):
        prop = PropertyFactory()
        payload = {
            "property": prop.id,
            "title": "X",
            "content": "Y",
            "rating": 6,  # > 5, invalid
        }
        response = auth_client.post(self.url, payload, format="json")
        assert response.status_code == 400
