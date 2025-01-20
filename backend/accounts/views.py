from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ValidationError
from rest_framework_simplejwt.exceptions import TokenError

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import decorator_from_middleware
from django.middleware.csrf import CsrfViewMiddleware

# Apply the CSRF middleware
csrf_protected = decorator_from_middleware(CsrfViewMiddleware)

@ensure_csrf_cookie
def set_csrf_cookie(request):
    return JsonResponse({"message": "CSRF cookie set"})



class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            
            # Create response
            response = Response({
                "detail": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

            

            # HttpOnly cookies for access & refresh tokens
            # Access Token cookie
            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,       # recommended for production (HTTPS)
                samesite='None'    # or 'Strict' / 'Lax' depending on your needs
            )

            # Refresh Token cookie
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='None'
            )

            return response
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Received refresh token: {refresh_token}")  # Debugging

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except TokenError as e:
            # If the token is already blacklisted, still return a successful response.
            print(f"Token error: {str(e)}")  # Debugging
            return Response({"detail": "Token already blacklisted."}, status=status.HTTP_200_OK)

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # If the user didn't provide a username, use the email prefix
        if not validated_data.get('username'):
            email = validated_data['email']
            username_candidate = email.split('@')[0]  # take prefix before '@'
            validated_data['username'] = username_candidate
        
        # Hash the password
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validation
        if User.objects.filter(username=username).exists():
            raise ValidationError({'username': 'Username already exists.'})
        if User.objects.filter(email=email).exists():
            raise ValidationError({'email': 'Email already in use.'})

        # Create user
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)

class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "recipes": [
                {"id": 1, "title": "Roasted Chicken"},
                {"id": 2, "title": "Chocolate Cake"},
            ]
        })
    
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
            "recipes": [
                {"id": 1, "title": "Roasted Chicken"},
                {"id": 2, "title": "Vegan Pasta"},
            ],
        }
        return Response(data)
from django.http import JsonResponse

class PasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        print("CSRF token from headers:", request.headers.get("X-CSRFToken"))
        print("CSRF cookie:", request.COOKIES.get("csrftoken"))
        # Process the reset logic
