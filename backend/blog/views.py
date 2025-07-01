from rest_framework import viewsets, permissions, status, generics, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import BlogPost, Comment, BlogLike
from .serializers import BlogPostSerializer, CommentSerializer, BlogLikeSerializer
from .permissions import IsAuthorOrReadOnly, IsAuthorOrAdminDeleteOnly
from adminside.models import BlogCategory
from adminside.serializers import CategorySerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from django.db import IntegrityError

class CustomPageNumberPagination(PageNumberPagination):
    page_size=10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-timestamp')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminDeleteOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        title = request.data.get('title', '').strip()
        # 1) Pre‐check for duplicates (case‑insensitive)
        if BlogPost.objects.filter(title__iexact=title).exists():
            return Response(
                {"title": ["Title already exists. Please choose another name."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2) Fallback catch for race conditions
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"title": ["Title already exists. Please choose another name."]},
                status=status.HTTP_400_BAD_REQUEST
            )

    
class UserBlogListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user).order_by('-timestamp')
    
    


        

class BlogCategoryListViewSet(ListAPIView):
    queryset = BlogCategory.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    

    
    
class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = BlogPost.objects.filter(status='published')
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset.order_by('-timestamp')


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id).order_by('-created_at')

    def perform_create(self, serializer):
        blog_id = self.kwargs['blog_id']
        serializer.save(user=self.request.user, blog_id=blog_id)
        
        
class ToggleLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, blog_id):
        blog = BlogPost.objects.get(id=blog_id)
        user = request.user

        # Check if already liked
        existing_like = BlogLike.objects.filter(blog=blog, user=user).first()

        if existing_like:
            existing_like.delete()
            liked = False
        else:
            BlogLike.objects.create(blog=blog, user=user)
            liked = True

        likes_count = BlogLike.objects.filter(blog=blog).count()

        return Response({
            'liked': liked,
            'likes_count': likes_count,
        }, status=status.HTTP_200_OK)