from django.urls import path
from .views import (
    PropertyListView, PropertyDetailView, PropertyDetailRoomView,
    PurchaseView, SuccessView
    )

app_name = 'stores'
urlpatterns = [
    path('property_list/', PropertyListView.as_view(), name='property_list'),
    path('property_detail/<int:pk>/', PropertyDetailView.as_view(), name='property_detail'),
    path('property_detail_room/<int:pk>/', PropertyDetailRoomView.as_view(), name='property_detail_room'),
    path('purchase/<int:pk>/', PurchaseView.as_view(), name='purchase'),
    path('success/', SuccessView.as_view(), name='success')
]
