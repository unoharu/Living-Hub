from django import forms
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm


GENDER_CHOICES = [
    ('N', '選択しない'),
    ('M', '男性'),
    ('F', '女性'),
]

class RegistForm(UserCreationForm):
    email = forms.EmailField(
        label='メールアドレス',
        max_length=100,
        widget=forms.EmailInput(attrs={'class': 'signup-inputs'}),
    )

    username = forms.CharField(
        label='名前',
        max_length=100,
        widget=forms.TextInput(attrs={'class': 'signup-inputs'}),
    )

    birthday = forms.DateField(
        label='生年月日',
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'signup-inputs'}),
        required=False,
    )

    sex = forms.ChoiceField(
        label='性別',
        choices=GENDER_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'sex-inputs'}),
        required=False,
        initial='N'
    )

    nationality = forms.CharField(
        label='国籍',
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={'class': 'signup-inputs'}),
    )

    job = forms.CharField(
        label='職業',
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={'class': 'signup-inputs'}),
    )

    self_introduction = forms.CharField(
        label='自己紹介',
        max_length=1000,
        required=False,
        widget=forms.Textarea(attrs={'class': 'intro-inputs'}),
    )


    profile_picture = forms.FileField(
        label='プロフィール画像',
        required=False,
        widget=forms.FileInput(attrs={'class': 'icon-inputs', 'accept': 'image/*'}),
    )

    password1 = forms.CharField(
        label='パスワード',
        widget=forms.PasswordInput(attrs={'class': 'signup-inputs'}),
    )

    password2 = forms.CharField(
        label='パスワード確認',
        widget=forms.PasswordInput(attrs={'class': 'signup-inputs'}),
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'birthday', 'sex', 'nationality', 'self_introduction', 'job', 'profile_picture']

    def save(self, commit=False):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password1')

        try:
            # パスワードの検証
            validate_password(password, user)
        except forms.ValidationError as e:
            # エラーメッセージを取得し、フィールドに追加
            self.add_error('password1', e.message)

        user.set_password(password)
        user.save()
        return user

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.render_value = True
    

class UserLoginForm(AuthenticationForm):
    username = forms.EmailField(label='メールアドレス', required=False,
            widget=forms.TextInput(
            attrs={'placeholder':'メールアドレス', 'class':'inputs'}))
    password = forms.CharField(label='パスワード', required=False,
            widget=forms.PasswordInput(
            attrs={'placeholder':'パスワード', 'class':'inputs'}))
    remember = forms.BooleanField(label='ログイン状態を保持する', required=False)
    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if email and password:
            # ユーザーの認証を試みる
            user = authenticate(email=email, password=password)

            # 認証に失敗した場合はエラーメッセージを追加
            if user is None or not user.is_active:
                raise ValidationError('メールアドレスまたはパスワードが正しくありません。', code='invalid_login')
        else:
            raise ValidationError('メールアドレスまたはパスワードが正しくありません。', code='invalid_login')
        return self.cleaned_data

class UpdateForm(forms.ModelForm):
    sex = forms.ChoiceField(
    label='性別',
    choices=GENDER_CHOICES,
    widget=forms.RadioSelect(attrs={'class': 'sex-inputs'}),
    required=False,
    initial='N'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'birthday', 'sex', 'nationality', 'self_introduction', 'job', 'profile_picture']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['username'].widget = forms.TextInput(attrs={'type': 'text', 'class': 'mypage-inputs'})
        self.fields['email'].widget = forms.EmailInput(attrs={'type': 'email', 'class': 'mypage-inputs'})
        self.fields['birthday'].widget = forms.DateInput(attrs={'type': 'date', 'class': 'mypage-inputs'})
        self.fields['nationality'].widget = forms.TextInput(attrs={'type': 'text', 'class': 'mypage-inputs'})
        self.fields['job'].widget = forms.TextInput(attrs={'type': 'text', 'class': 'mypage-inputs'})
        self.fields['self_introduction'].widget = forms.TextInput(attrs={'type': 'text', 'class': 'intro-mypage-inputs'})
        self.fields['profile_picture'].widget = forms.ClearableFileInput(attrs={'type': 'file', 'class': 'mypage-file-inputs', 'accept': 'image/*'})