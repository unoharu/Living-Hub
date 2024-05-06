from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)
from stores.models import Property
from django.urls import reverse_lazy


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('Enter Email')
        user = self.model(
            username=username,
            email=email
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.model(
            username=username,
            email=email
        )
        user.set_password(password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name='メールアドレス', max_length=100, unique=True)
    username = models.CharField(verbose_name='名前', max_length=100, unique=True)
    birthday = models.DateField(verbose_name='生年月日', null=True, blank=True)
    sex = models.CharField(max_length=50, verbose_name='性別', null=True, blank=True)
    nationality = models.CharField(verbose_name='国籍', max_length=50, null=True, blank=True)
    self_introduction = models.CharField(verbose_name='自己紹介', max_length=1000, null=True, blank=True)
    job = models.CharField(verbose_name='職業', max_length=50, null=True, blank=True)
    profile_picture = models.FileField(verbose_name='プロフィール画像', upload_to='profile/', max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    contract = models.FileField(verbose_name="契約申請書", upload_to='contract/', max_length=100, null=True, blank=True)
    contract_property = models.ForeignKey(Property, verbose_name="契約物件", on_delete=models.CASCADE, null=True, blank=True)
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()


    def get_absolute_url(self):
        return reverse_lazy('accounts:home')
