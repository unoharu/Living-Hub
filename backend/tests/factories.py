"""
factory_boy factories for tests.

Use these to create DB objects with sensible defaults:
    PropertyFactory()                    → saves to DB
    PropertyFactory.build()              → in-memory only
    PropertyFactory(ward=some_ward)      → override specific fields
"""
import factory
from django.utils import timezone

from apps.accounts.models import User
from apps.bulletin.models import Article
from apps.inquiries.models import ViewingRequest
from apps.interactions.models import Favorite, Review
from apps.properties.models import (
    Amenity,
    AmenityCategory,
    City,
    Property,
    PropertyType,
    Unit,
    Ward,
)


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    last_name = "田中"
    first_name = "太郎"
    password = factory.PostGenerationMethodCall("set_password", "password123")
    is_active = True


class CityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = City
        django_get_or_create = ("name",)

    name = "東京都"


class WardFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Ward
        django_get_or_create = ("city", "name")

    city = factory.SubFactory(CityFactory)
    name = factory.Sequence(lambda n: f"新宿区{n}")


class PropertyTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PropertyType
        django_get_or_create = ("name",)

    name = "マンション"


class PropertyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Property

    property_type = factory.SubFactory(PropertyTypeFactory)
    ward = factory.SubFactory(WardFactory)
    property_name = factory.Sequence(lambda n: f"テスト物件{n}")
    address = "東京都新宿区1-2-3"
    station = "新宿駅"
    line = "JR山手線"
    walk_minute = 5
    year_built = 2020
    phone_number = "03-0000-0000"


class UnitFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Unit

    property = factory.SubFactory(PropertyFactory)
    room_number = factory.Sequence(lambda n: f"{n:03d}")
    floor = 3
    layout = "1LDK"
    area = "45.00"
    rent = 150000
    management_fee = 10000
    availability = Unit.Availability.AVAILABLE


class AmenityCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AmenityCategory
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"カテゴリ{n}")


class AmenityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Amenity
        django_get_or_create = ("category", "name")

    category = factory.SubFactory(AmenityCategoryFactory)
    name = factory.Sequence(lambda n: f"設備{n}")


class FavoriteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Favorite

    user = factory.SubFactory(UserFactory)
    property = factory.SubFactory(PropertyFactory)


class ReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Review

    user = factory.SubFactory(UserFactory)
    property = factory.SubFactory(PropertyFactory)
    title = "良い物件でした"
    content = "駅から近くて便利でした。"
    rating = 4


class ViewingRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ViewingRequest

    user = factory.SubFactory(UserFactory)
    unit = factory.SubFactory(UnitFactory)
    preferred_date = "2026-04-01"
    status = ViewingRequest.Status.PENDING


class ArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Article

    author = factory.SubFactory(UserFactory)
    title = factory.Sequence(lambda n: f"テスト投稿{n}")
    content = "投稿内容のサンプルです。"
