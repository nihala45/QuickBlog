from django.urls import path, include
from .views import AdminLoginView, UserViewSet, BlogCategoryViewSet, AdminBlogPostViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', BlogCategoryViewSet, basename='categories')
router.register(r'admin/blogs', AdminBlogPostViewSet, basename='admin-blogs')


urlpatterns = [
    path('login/',AdminLoginView.as_view(), name='admin_login'),
    path('', include(router.urls)),
]