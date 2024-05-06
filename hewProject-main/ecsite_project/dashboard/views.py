from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import DetailView, ListView, CreateView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
import os

from .forms import ArticleForm
from .models import Article




class DashboardCreateView(LoginRequiredMixin, CreateView):
    model = Article
    form_class = ArticleForm
    success_url =  reverse_lazy('dashboard:dashboard_list')

    def form_valid(self, form):
        form.instance.user = self.request.user  # ログインユーザーを記事の投稿者として設定
        return super().form_valid(form)

class DashboardListView(LoginRequiredMixin, ListView):
    model = Article
    template_name = 'dashboard/dashboard_list.html'

    def get_queryset(self):
        # ログインしているユーザーの物件のIDを取得
        user_property_id = self.request.user.contract_property_id
        
        # 物件に関連する記事のクエリを取得
        queryset = super().get_queryset().filter(user__contract_property=user_property_id)
        
        return queryset

class DashboardDetailView(LoginRequiredMixin, DetailView):
    model = Article
    template_name = os.path.join('dashboard', 'dashboard_detail.html')