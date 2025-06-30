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
    """
    Admin-only viewset for managing users.
    Supports listing verified users and blocking/unblocking accounts.
    """
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        """
        List only users with verified emails.
        """
        return Users.objects.filter(is_email_verified=True)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        """
        Block a user (set is_active = False).
        """
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
        """
        Unblock a user (set is_active = True).
        """
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
        
        
    
class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset().order_by('name')
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