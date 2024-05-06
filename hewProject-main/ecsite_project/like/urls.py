from django.urls import path
from . import views


app_name = 'like'
urlpatterns = [
    path('like/', views.like, name='like'),
    path('like_list/', views.UserLikeListView.as_view(), name='like_list'),
    path('like_status/', views.LikeStatusView.as_view(), name='like_status'),
]