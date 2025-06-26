from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, action
from django.contrib.auth import authenticate
from .models import User
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
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone = serializer.validated_data.get('phone')

       
            if User.objects.filter(email__iexact=email, is_email_verified=True).exists():
                return Response({"email": "This email is already verified and registered."}, status=status.HTTP_400_BAD_REQUEST)

            
            User.objects.filter(email__iexact=email, is_email_verified=False).delete()

            
            if User.objects.filter(phone=phone).exists():
                return Response({"phone": "This phone number is already taken."}, status=status.HTTP_400_BAD_REQUEST)

     
            otp_secret = pyotp.random_base32()
            totp = pyotp.TOTP(otp_secret, interval=300)  
            otp = totp.now()
            print('Generated OTP:', otp)

            
            user = serializer.save(email_otp=otp)

           
            try:
                send_mail(
                    subject='Email Verification OTP',
                    message=f'Hi {user.username},\n\nYour OTP is: {otp}\nIt is valid for 5 minutes.',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response({"msg": "Failed to send OTP email", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'msg': 'Registration Successful. OTP sent to your email.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)