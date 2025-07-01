from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import generics, permissions, status, viewsets, serializers, mixins
from account.models import Users
from .models import BlogCategory
from account.serializers import UserSerializer
from rest_framework.decorators import action
from .serializers import CategorySerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from blog.models import BlogPost
from blog.serializers import BlogPostSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from blog.views import CustomPageNumberPagination

class AdminLoginView(APIView):
    def post(self,request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email,password = password)
        print(email,password)
        print(user)

        if user is not None and user.is_superuser:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh' : str(refresh),
                'access' : str(refresh.access_token),
                  'is_superuser': user.is_superuser
            })
        return Response({'detail' : 'Invalid credentials or not an admin '}, status=status.HTTP_401_UNAUTHORIZED)

    
    

class UserViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'phone']

    def get_queryset(self):
        return Users.objects.filter(is_email_verified=True)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        user.is_active = False
        user.save()
        return Response(
            {'status': 'User blocked successfully.'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        user.is_active = True
        user.save()
        return Response(
            {'status': 'User unblocked successfully.'},
            status=status.HTTP_200_OK
        )
        
    
# blog/views.py



class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Category deleted."}, status=status.HTTP_204_NO_CONTENT)

    
    
    
class AdminBlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-timestamp")
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'content']
    filterset_fields = ['category']

    def get_queryset(self):
        """
        For listing, return only published blogs.
        For retrieve/update/delete, allow all blogs.
        """
        if self.action == 'list':
            return BlogPost.objects.filter(status='published').order_by("-timestamp")
        return BlogPost.objects.all().order_by("-timestamp")

    def perform_create(self, serializer):
        # Always save admin user as the author
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Admin can only edit their own blog post content
        if instance.author != request.user:
            return Response(
                {"detail": "Admins can only edit their own blog posts."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Admin can delete any blog post
        return super().destroy(request, *args, **kwargs)

    queryset = BlogPost.objects.all().order_by("-timestamp")
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'content']
    filterset_fields = ['category']
    def perform_create(self, serializer):
        # Always save admin user as the author
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Admin can only edit their own blog post content
        if instance.author != request.user:
            return Response(
                {"detail": "Admins can only edit their own blog posts."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Admin can delete any blog post
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def drafts(self, request):
        drafts = BlogPost.objects.filter(
            author=request.user,
            status='draft'
        ).order_by('-timestamp')

        page = self.paginate_queryset(drafts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)