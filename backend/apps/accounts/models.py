"""Custom User model replacing Django's default User."""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager["User"]):
    def create_user(self, email: str, password: str | None = None, **extra_fields) -> "User":
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user: User = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str, **extra_fields) -> "User":
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Sex(models.TextChoices):
        MALE = "male", "男性"
        FEMALE = "female", "女性"
        OTHER = "other", "その他"
        PREFER_NOT = "prefer_not", "回答しない"

    email = models.EmailField(unique=True)
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    birthday = models.DateField(null=True, blank=True)
    sex = models.CharField(max_length=20, choices=Sex.choices, blank=True)
    profile_picture = models.ImageField(
        upload_to="profile/", null=True, blank=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["last_name", "first_name"]

    class Meta:
        db_table = "users"
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"

    def __str__(self) -> str:
        return f"{self.last_name} {self.first_name} <{self.email}>"
