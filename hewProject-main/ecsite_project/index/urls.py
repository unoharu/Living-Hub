from django.urls import path
from . import views


app_name = 'index'
urlpatterns = [
    path('', views.index, name='index'),
    path('city-transformed.glb', views.glb_file, name='glb_file'),
]