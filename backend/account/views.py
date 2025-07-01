from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
import pyotp
from .models import Users
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer
import random
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser, FormParser

class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("REQUEST DATA →", request.data)

        email = request.data.get("email", "").strip().lower()
        username = request.data.get("username", "").strip()
        phone = request.data.get("phone", "").strip()
        password = request.data.get("password")

        if not email or not username or not phone or not password:
            return Response(
                {"msg": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Users.objects.filter(email=email, is_email_verified=True).exists():
            return Response(
                {"email": "This email is already verified and registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Users.objects.filter(phone=phone).exists():
            return Response(
                {"phone": "This phone number is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_unverified = Users.objects.filter(email=email, is_email_verified=False).first()

        otp_secret = pyotp.random_base32()
        totp = pyotp.TOTP(otp_secret, interval=300)  # OTP valid for 5 minutes
        otp = totp.now()
        print("Generated OTP →", otp)

        if existing_unverified:
            existing_unverified.username = username
            existing_unverified.phone = phone
            existing_unverified.set_password(password)
            existing_unverified.email_otp = otp
            existing_unverified.save()
            user = existing_unverified
        else:
            user = Users(
                email=email,
                username=username,
                phone=phone,
                email_otp=otp,
            )
            user.set_password(password)
            user.save()

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
            {
                "msg": "Registration successful. OTP sent to your email.",
                "id": user.id
            },
            status=status.HTTP_201_CREATED
        )
        
        
class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

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
                'id': user.id,
                'email': user.email,
            })

        return Response({'error': 'Invalid credentials'}, status=400)
    
    
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        try:
            user = Users.objects.get(email=email, is_email_verified=True)

            # Generate a 6-digit numeric OTP
            otp = str(random.randint(100000, 999999))
            print("Generated OTP Forget →", otp)

            # Save it to the user model
            user.email_otp = otp
            user.save()

            send_mail(
                subject='Password Reset OTP',
                message=f'Hi {user.username},\n\nYour OTP for password reset is: {otp}\nIt is valid for 5 minutes.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response(
                {
                    "message": "OTP sent to your email.",
                    "id": user.id,
                },
                status=status.HTTP_200_OK
            )

        except Users.DoesNotExist:
            return Response(
                {"error": "No account found with this email."},
                status=status.HTTP_404_NOT_FOUND
            )    
            
class VerifyForgotPasswordOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        otp = request.data.get('email_otp')

        try:
            user = Users.objects.get(id=pk)

            if user.email_otp == otp:
                user.email_otp = None  
                user.save()

                return Response({"message": "OTP verified."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        except Users.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        password = request.data.get('password')

        if not password or len(password) < 6:
            return Response(
                {"error": "Password must be at least 6 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = Users.objects.get(id=pk)
            user.password = make_password(password)
            user.save()

            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )

        except Users.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

       
    
    
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
    
    
class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete the authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(
            {"detail": "Your account has been successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )