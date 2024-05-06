from django.urls import path
from .views import DashboardListView, DashboardDetailView, DashboardCreateView

app_name = 'dashboard'
urlpatterns = [
    path('article_create/', DashboardCreateView.as_view(), name='article_create'),
    path('dashboard_list/', DashboardListView.as_view(), name='dashboard_list'),
    path('dashboard_detail/<int:pk>/', DashboardDetailView.as_view(), name='dashboard_detail'),
]