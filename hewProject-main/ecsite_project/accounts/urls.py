from django.urls import path
from .views import (
    RegistUserView, UserLoginView,
    UserLogoutView, UserView, UserDataConfirm,
    UserDataCreate, Success, PasswordChangeView,
    PasswordChangeDoneView, UpdateView, UpdateDoneView,
    ProfileView, CustomLogoutView, MyPropertyView, 
    language_switch
)

app_name = 'accounts'
urlpatterns = [
    path('regist/', RegistUserView.as_view(), name='regist'),
    path('user_confirm/', UserDataConfirm.as_view(), name='user_confirm'),
    path('success/', Success.as_view(), name='success'),
    path('user_create/', UserDataCreate.as_view(), name='user_create'),
    path('user_login/', UserLoginView.as_view(), name='user_login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('user_logout/', UserLogoutView.as_view(), name='user_logout'),
    path('user/', UserView.as_view(), name='user'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password_change/', PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', PasswordChangeDoneView.as_view(), name='password_change_done'), 
    path('update/', UpdateView.as_view(), name='update'), 
    path('update_done/', UpdateDoneView.as_view(), name='update_done'), 
    path('<str:language_code>/language_swich/', language_switch, name='language_switch'),
    path('my_property/', MyPropertyView.as_view(), name='my_property'), 
]