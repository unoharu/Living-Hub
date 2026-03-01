"""
Property domain models.

Hierarchy: City → Ward, PropertyType → Property → Unit
Images are stored separately for buildings (PropertyImage) and rooms (UnitImage).
Amenities use a category + M2M design so new equipment can be added without migrations.
"""
from django.db import models


class City(models.Model):
    """Prefecture level (都道府県)."""
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "cities"
        verbose_name = "都道府県"
        verbose_name_plural = "都道府県"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Ward(models.Model):
    """Municipality level (区市町村)."""
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="wards")
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "wards"
        verbose_name = "区市町村"
        verbose_name_plural = "区市町村"
        unique_together = [["city", "name"]]
        ordering = ["city", "name"]

    def __str__(self) -> str:
        return f"{self.city.name} {self.name}"


class PropertyType(models.Model):
    """Building type (マンション・アパート・戸建て etc.)."""
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "property_types"
        verbose_name = "物件種別"
        verbose_name_plural = "物件種別"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class AmenityCategory(models.Model):
    """Amenity category (バス・トイレ / キッチン / 設備・サービス / その他)."""
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = "amenity_categories"
        verbose_name = "設備カテゴリ"
        verbose_name_plural = "設備カテゴリ"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Amenity(models.Model):
    """Individual amenity item (バスタブ / IH / 独立洗面台 etc.)."""
    category = models.ForeignKey(
        AmenityCategory, on_delete=models.CASCADE, related_name="amenities"
    )
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "amenities"
        verbose_name = "設備"
        verbose_name_plural = "設備"
        unique_together = [["category", "name"]]
        ordering = ["category", "name"]

    def __str__(self) -> str:
        return f"{self.category.name} / {self.name}"


class Property(models.Model):
    """Building that contains one or more units."""
    property_type = models.ForeignKey(
        PropertyType, on_delete=models.PROTECT, related_name="properties"
    )
    ward = models.ForeignKey(
        Ward, on_delete=models.PROTECT, related_name="properties"
    )
    property_name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    station = models.CharField(max_length=100, help_text="最寄り駅名")
    line = models.CharField(max_length=100, help_text="沿線名")
    walk_minute = models.PositiveSmallIntegerField(help_text="駅からの徒歩分数")
    year_built = models.PositiveSmallIntegerField(help_text="築年（西暦）")
    phone_number = models.CharField(max_length=20)
    cover_image = models.ImageField(
        upload_to="property_covers/", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "properties"
        verbose_name = "物件"
        verbose_name_plural = "物件"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.property_name


class PropertyImage(models.Model):
    """Exterior / common area photos for a building."""
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")
    order = models.PositiveSmallIntegerField(default=0, help_text="表示順（小さい順）")

    class Meta:
        db_table = "property_images"
        verbose_name = "物件画像"
        verbose_name_plural = "物件画像"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.property.property_name} 画像 {self.order}"


class Unit(models.Model):
    """Room / unit inside a building."""
    class Availability(models.TextChoices):
        AVAILABLE = "available", "空室"
        RESERVED = "reserved", "予約中"
        CONTRACTED = "contracted", "契約済"

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="units"
    )
    room_number = models.CharField(max_length=10)
    floor = models.PositiveSmallIntegerField()
    layout = models.CharField(max_length=20, help_text="1K, 2LDK etc.")
    layout_image = models.ImageField(
        upload_to="layout_images/", null=True, blank=True
    )
    area = models.DecimalField(
        max_digits=6, decimal_places=2, help_text="専有面積（㎡）"
    )
    rent = models.PositiveIntegerField(help_text="賃料（円）")
    management_fee = models.PositiveIntegerField(default=0, help_text="管理費（円）")
    deposit_months = models.PositiveSmallIntegerField(
        default=0, help_text="敷金（賃料の何ヶ月分）"
    )
    key_money_months = models.PositiveSmallIntegerField(
        default=0, help_text="礼金（賃料の何ヶ月分）"
    )
    credit_card_ok = models.BooleanField(default=True)
    parking = models.BooleanField(default=False)
    pet_allowed = models.BooleanField(default=False)
    position = models.CharField(max_length=20, blank=True, help_text="向き（南向き等）")
    remarks = models.TextField(blank=True)
    tour_url = models.URLField(blank=True, help_text="外部VR内見URL")
    # True only for the single unit that has hewroom.glb in 3DRoom/
    has_3d_model = models.BooleanField(
        default=False,
        help_text="3Dモデルが存在するかどうか。Trueの部屋のみ3Dボタンを表示する。",
    )
    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        default=Availability.AVAILABLE,
    )
    amenities = models.ManyToManyField(
        Amenity, through="UnitAmenity", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "units"
        verbose_name = "部屋"
        verbose_name_plural = "部屋"
        ordering = ["property", "room_number"]

    def __str__(self) -> str:
        return f"{self.property.property_name} {self.room_number}"


class UnitAmenity(models.Model):
    """Through table for Unit ↔ Amenity M2M."""
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)

    class Meta:
        db_table = "unit_amenities"
        unique_together = [["unit", "amenity"]]


class UnitImage(models.Model):
    """Interior photos for a unit/room."""
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="unit_images/")
    order = models.PositiveSmallIntegerField(default=0, help_text="表示順（小さい順）")

    class Meta:
        db_table = "unit_images"
        verbose_name = "部屋画像"
        verbose_name_plural = "部屋画像"
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.unit} 画像 {self.order}"
