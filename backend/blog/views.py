from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from blog.models import BlogPost
from blog.serializers import BlogPostSerializer
from blog.permissions import IsAuthorOrReadOnly
from adminside.models import BlogCategory
from adminside.serializers import CategorySerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated



class BlogPostViewSet(viewsets.ModelViewSet):
  
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        return BlogPost.objects.all().order_by('-timestamp')
    def perform_create(self, serializer):
        print('this is ewowwwwwwwwrkkkkkkkkkkk')
        serializer.save(author=self.request.user)
    
    

class UserBlogListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user).order_by('-timestamp')

        

class BlogCategoryListViewSet(ListAPIView):
    queryset = BlogCategory.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    
class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(status='published')
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset.order_by('-timestamp')

