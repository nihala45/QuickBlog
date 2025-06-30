from django.urls import path, include
from .views import UserRegisterView, VerifyOTPView, LoginView, UserProfileView, UserProfileEditView, ForgotPasswordView, VerifyForgotPasswordOTPView, ResetPasswordView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()


urlpatterns = [
    path('user/register/',UserRegisterView.as_view(), name='user_register'),
    path('user/verify_otp/<int:pk>/',VerifyOTPView.as_view(), name='verify_otp'),
    path('user/login/',LoginView.as_view(), name='user-login'),
    path('user/profile_view/',UserProfileView.as_view(), name='user-profile-view'),
    path('user/profile_edit_view/',UserProfileEditView.as_view(), name='user-profile-edit'),
    # path('user/profile_edit_view/',UserProfileEditView.as_view(), name='user-profile-edit'),
    path('user/forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('user/verify_forgot_password_otp/<int:pk>/', VerifyForgotPasswordOTPView.as_view(), name='verify_forgot_password_otp'),
    path('user/reset_password/<int:pk>/', ResetPasswordView.as_view(), name='reset_password'),
    
    path('', include(router.urls)),
]