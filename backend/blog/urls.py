from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryListViewSet, PublicBlogPostViewSet, UserBlogListView


router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blog')
router.register(r'public/blogs', PublicBlogPostViewSet, basename='public-blog')

urlpatterns = [
    path('blog/categories/', BlogCategoryListViewSet.as_view(), name='category-list'),
    path('blogs/my-blogs/', UserBlogListView.as_view(), name='my-blogs'),
    path('', include(router.urls)),
]
