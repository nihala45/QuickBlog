from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryListViewSet, PublicBlogPostViewSet, UserBlogListView, CommentListCreateAPIView, ToggleLikeAPIView


router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blog')
router.register(r'public/blogs', PublicBlogPostViewSet, basename='public-blog')

urlpatterns = [
    path('blog/categories/', BlogCategoryListViewSet.as_view(), name='category-list'),
    path('blogs/my-blogs/', UserBlogListView.as_view(), name='my-blogs'),
    path('blogs/<int:blog_id>/comments/', CommentListCreateAPIView.as_view(), name='blog-comments'),
    path('blogs/<int:blog_id>/like/', ToggleLikeAPIView.as_view(), name='blog-like'),
    path('', include(router.urls)),
]
