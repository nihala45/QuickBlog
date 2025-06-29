from django.urls import path, include
from .views import UserRegisterView, VerifyOTPView, LoginView, UserProfileView, UserProfileEditView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()


urlpatterns = [
    path('user/register/',UserRegisterView.as_view(), name='user_register'),
    path('user/verify_otp/<int:pk>/',VerifyOTPView.as_view(), name='verify_otp'),
    path('user/login/',LoginView.as_view(), name='user-login'),
    path('user/profile_view/',UserProfileView.as_view(), name='user-profile-view'),
    path('user/profile_edit_view/',UserProfileEditView.as_view(), name='user-profile-edit'),
    
    path('', include(router.urls)),
]