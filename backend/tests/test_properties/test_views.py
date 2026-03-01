"""
Tests for properties API: list, detail, filter, and unit endpoints.
"""
import pytest
from django.urls import reverse

from tests.factories import PropertyFactory, UnitFactory, WardFactory


@pytest.mark.django_db
class TestPropertyList:
    url = reverse("property-list")

    def test_returns_200_and_paginated_results(self, api_client):
        PropertyFactory.create_batch(3)
        response = api_client.get(self.url)
        assert response.status_code == 200
        assert response.data["count"] == 3
        assert len(response.data["results"]) == 3

    def test_filter_by_ward(self, api_client):
        ward_a = WardFactory(name="新宿区0")
        ward_b = WardFactory(name="渋谷区0", city=ward_a.city)
        PropertyFactory(ward=ward_a)
        PropertyFactory(ward=ward_b)

        response = api_client.get(self.url, {"ward": ward_a.id})
        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["ward_name"] == ward_a.name

    def test_filter_by_max_rent(self, api_client):
        prop = PropertyFactory()
        UnitFactory(property=prop, rent=80000)
        prop2 = PropertyFactory()
        UnitFactory(property=prop2, rent=200000)

        response = api_client.get(self.url, {"max_rent": 100000})
        assert response.status_code == 200
        assert response.data["count"] == 1

    def test_is_favorite_false_for_unauthenticated(self, api_client):
        PropertyFactory()
        response = api_client.get(self.url)
        assert response.status_code == 200
        assert response.data["results"][0]["is_favorite"] is False

    def test_is_favorite_true_for_favorited_property(self, auth_client, user):
        from tests.factories import FavoriteFactory
        prop = PropertyFactory()
        FavoriteFactory(user=user, property=prop)

        response = auth_client.get(self.url)
        assert response.status_code == 200
        assert response.data["results"][0]["is_favorite"] is True


@pytest.mark.django_db
class TestPropertyDetail:
    def test_returns_full_detail(self, api_client):
        prop = PropertyFactory()
        UnitFactory(property=prop)
        url = reverse("property-detail", kwargs={"pk": prop.pk})

        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == prop.pk
        assert "units" in response.data
        assert "images" in response.data

    def test_returns_404_for_missing_property(self, api_client):
        url = reverse("property-detail", kwargs={"pk": 99999})
        response = api_client.get(url)
        assert response.status_code == 404


@pytest.mark.django_db
class TestPropertyUnitList:
    def test_returns_units_for_property(self, api_client):
        prop = PropertyFactory()
        UnitFactory.create_batch(2, property=prop)
        # Unit belonging to a different property — must NOT appear
        UnitFactory()

        url = reverse("property-unit-list", kwargs={"property_id": prop.pk})
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data["count"] == 2


@pytest.mark.django_db
class TestUnitDetail:
    def test_returns_unit_detail(self, api_client):
        unit = UnitFactory()
        url = reverse("unit-detail", kwargs={"pk": unit.pk})

        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == unit.pk
        assert "amenities_by_category" in response.data
