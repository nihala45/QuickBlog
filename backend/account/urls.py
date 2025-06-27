from django.urls import path, include
from .views import UserRegisterView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()


urlpatterns = [
    path('user/register/',UserRegisterView.as_view, name='user_register'),
    path('', include(router.urls)),
]