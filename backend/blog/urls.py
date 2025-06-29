from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryListViewSet, PublicBlogPostViewSet

router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blog')
router.register(r"user/categories", BlogCategoryListViewSet, basename="category")
router.register(r'public/blogs', PublicBlogPostViewSet, basename='public-blog')

urlpatterns = [
    path('', include(router.urls)),
]