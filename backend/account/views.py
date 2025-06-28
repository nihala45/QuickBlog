from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, action
from django.contrib.auth import authenticate
from .models import Users
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny
import pyotp
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache



class UserRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        print("REQUEST DATA →", request.data)

        # Extract the fields from the request directly
        email = request.data.get("email", "").strip().lower()
        username = request.data.get("username", "").strip()
        phone = request.data.get("phone", "").strip()
        password = request.data.get("password")

        # Check if a verified user already exists with this email
        if Users.objects.filter(email=email, is_email_verified=True).exists():
            return Response(
                {"email": "This email is already verified and registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the phone number exists
        if Users.objects.filter(phone=phone).exists():
            return Response(
                {"phone": "This phone number is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for unverified user with this email
        existing_unverified = Users.objects.filter(email=email, is_email_verified=False).first()

        # Generate OTP
        otp_secret = pyotp.random_base32()
        totp = pyotp.TOTP(otp_secret, interval=300)  # 5 minutes
        otp = totp.now()
        print("Generated OTP →", otp)

        if existing_unverified:
            # Update the unverified user instead of creating new
            existing_unverified.username = username
            existing_unverified.phone = phone
            existing_unverified.set_password(password)
            existing_unverified.email_otp = otp
            existing_unverified.save()

            user = existing_unverified
        else:
            # Create new user manually
            user = Users(
                email=email,
                username=username,
                phone=phone,
                email_otp=otp
            )
            user.set_password(password)
            user.save()

        # Send OTP email
        try:
            send_mail(
                subject='Email Verification OTP',
                message=f'Hi {user.username},\n\nYour OTP is: {otp}\nIt is valid for 5 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response(
                {"msg": "Failed to send OTP email", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"msg": "Registration successful. OTP sent to your email.",
             "id": user.id},
            status=status.HTTP_201_CREATED
        )
        
        
class VerifyOTPView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, pk):
        otp = request.data.get('email_otp')

        if not otp:
            return Response({'error': 'OTP is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Users.objects.get(id=pk)

            if user.email_otp == otp:
                user.is_email_verified = True
                user.email_otp = None
                user.save()

                refresh = RefreshToken.for_user(user)

                return Response({
                    'message': 'OTP verified successfully!',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': user.is_superuser,
                }, status=status.HTTP_200_OK)

            else:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=400)

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        if not user.is_email_verified:
            print(f"Blocked login for {user.email} because email is not verified.")
            return Response({'error': 'Email is not verified. Please verify your email to continue.'}, status=403)


        user = authenticate(request, email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_superuser': user.is_superuser,
            })

        return Response({'error': 'Invalid credentials'}, status=400)
    
    
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
    