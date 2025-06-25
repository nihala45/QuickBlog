from django.urls import path, include
from .views import RegisterView


urlpatterns = [
    path('user/register/',RegisterView.as_view, name='user_register')
]
