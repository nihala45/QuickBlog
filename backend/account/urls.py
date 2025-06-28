from django.urls import path, include
from .views import UserRegisterView, VerifyOTPView, LoginView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()


urlpatterns = [
    path('user/register/',UserRegisterView.as_view(), name='user_register'),
    path('user/verify_otp/<int:pk>/',VerifyOTPView.as_view(), name='verify_otp'),
    path('user/login/',LoginView.as_view(), name='user-login'),
    path('', include(router.urls)),
]