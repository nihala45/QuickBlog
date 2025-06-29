from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from blog.models import BlogPost
from blog.serializers import BlogPostSerializer
from blog.permissions import IsAuthorOrReadOnly
from adminside.models import BlogCategory
from adminside.serializers import CategorySerializer



class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            print("Blog created successfully!")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # This will check the IsAuthorOrReadOnly permission
        self.check_object_permissions(request, instance)
        instance.delete()
        return Response({"message": "Blog deleted."}, status=status.HTTP_204_NO_CONTENT)


        

class BlogCategoryListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class PublicBlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='published').order_by('-timestamp')
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(status='published')
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        return queryset