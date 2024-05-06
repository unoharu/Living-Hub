from django.shortcuts import render, redirect
from django.views.generic import CreateView, TemplateView, FormView, UpdateView, DetailView
from django.urls import reverse_lazy, reverse
from .forms import RegistForm, UserLoginForm, UpdateForm
from .models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView
import logging
from django.utils.translation import gettext as _
from django.utils.translation import get_language, activate
from django.shortcuts import HttpResponseRedirect
from urllib.parse import urlunparse, urlparse
import os

def language_switch(request, language_code):
    # 言語コードをアクティブ化
    activate(language_code)
    
    # リファラー情報を取得
    referer = request.META.get('HTTP_REFERER')
    
    # リファラーが存在する場合
    if referer:
        # リファラーからURLの要素を取得
        scheme, netloc, path, params, query, fragment = urlparse(referer)
        
        # 言語コードを挿入するためのリストに言語コードを追加
        path_elements = path.split('/')
        if path_elements[1] == 'en' or path_elements[1] == 'zh':
            path_elements[1] = language_code
        else:
            path_elements.insert(1, language_code)
        
        if 'ja' in path_elements:
            path_elements.remove('ja')
        # 新しいパスを作成
        new_path = '/'.join(path_elements)
        
        # 新しいURLを作成
        new_url = urlunparse((scheme, netloc, new_path, params, query, fragment))
        
        # リダイレクト
        return HttpResponseRedirect(new_url)
    
    # リファラーがない場合はデフォルトのホームページにリダイレクト
    return HttpResponseRedirect(reverse('accounts:home'))

logger = logging.getLogger(__name__)


class Success(TemplateView):
    template_name = 'success.html'

class RegistUserView(FormView):
    template_name = 'regist.html'
    form_class = RegistForm

    def form_valid(self, form):
        return render(self.request, 'regist.html', {'form': form})

class UserDataConfirm(FormView):
    form_class = RegistForm

    def form_valid(self, form):
        return render(self.request, 'user_confirm.html', {'form': form})

    def form_invalid(self, form):
        return render(self.request, 'regist.html', {'form': form})


class UserDataCreate(CreateView):
    form_class = RegistForm
    success_url = reverse_lazy('accounts:success')

    def form_valid(self, form):
        # フォームが有効な場合の処理
        response = super().form_valid(form)

        # ユーザーをログインさせる
        user = authenticate(self.request, email=form.cleaned_data['email'], password=form.cleaned_data['password1'])
        login(self.request, user)

        return response

    def form_invalid(self, form):
        # フォームが無効な場合の処理
        return render(self.request, 'regist.html', {'form': form})


class UserLoginView(LoginView):
    template_name = 'user_login.html'
    authentication_form = UserLoginForm

    def form_valid(self, form):
        # フォームが有効な場合の処理
        email = form.cleaned_data['username']
        password = form.cleaned_data['password']

        remember = form.cleaned_data.get('remember')

        user = authenticate(self.request, email=email, password=password)

        if user is not None:
            # ログイン成功時の処理
            login(self.request, user)

            if not remember:
                self.request.session.set_expiry(0)

            return redirect('stores:property_list')  # ログイン後に遷移するURLを指定
        else:
            # ログイン失敗時の処理
            
            return self.form_invalid(form)

    def form_invalid(self, form):
        # フォームが無効な場合の処理
        return self.render_to_response(self.get_context_data(form=form))

class CustomLogoutView(TemplateView):
    template_name = os.path.join('accounts', 'logout.html')

class UserLogoutView(LoginRequiredMixin, LogoutView):
    pass


class UserView(LoginRequiredMixin, TemplateView):
    template_name = 'user.html'

class ProfileView(LoginRequiredMixin, DetailView):
    template_name = os.path.join('accounts', 'profile.html')
    model = User
    context_object_name = 'user'

    def get_object(self, queryset=None):
        return self.request.user

class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name in self.fields:
            self.fields[field_name].widget.attrs['class'] = 'mypage-inputs'

class PasswordChangeView(LoginRequiredMixin, PasswordChangeView):
    template_name = os.path.join('accounts', 'password_change.html')
    form_class = CustomPasswordChangeForm
    success_url = reverse_lazy('accounts:password_change_done')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs) # 継承元のメソッドCALL
        context["form_name"] = "password_change"
        return context

class PasswordChangeDoneView(LoginRequiredMixin, PasswordChangeDoneView):
    template_name = os.path.join('accounts', 'password_change_done.html')


class UpdateView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UpdateForm
    template_name = os.path.join('accounts', 'update.html')
    success_url = reverse_lazy('accounts:update_done')

    def get_object(self, queryset=None):
        return self.request.user
    
class UpdateDoneView(LoginRequiredMixin, TemplateView):
    template_name = os.path.join('accounts', 'update_done.html')

class MyPropertyView(LoginRequiredMixin, TemplateView):
    template_name = os.path.join('accounts', 'my_property.html')

