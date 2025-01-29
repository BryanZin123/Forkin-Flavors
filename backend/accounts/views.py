from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ValidationError
from rest_framework_simplejwt.exceptions import TokenError
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

### **LOGIN VIEW**
class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow login for all users

    def post(self, request):
        identifier = request.data.get('identifier')  # Can be username or email
        password = request.data.get('password')

        if not identifier or not password:
            return Response({'detail': 'Username/Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if identifier is an email or username
        user = None
        if '@' in identifier:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = authenticate(username=identifier, password=password)

        # Validate user and password
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            response = Response({
                "detail": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

            # Set HttpOnly cookies for security
            response.set_cookie("access", str(refresh.access_token), httponly=True, secure=True, samesite='None')
            response.set_cookie("refresh", str(refresh), httponly=True, secure=True, samesite='None')

            return response

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


### **LOGOUT VIEW**
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token if blacklisting is enabled
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"detail": "Invalid or already blacklisted token."}, status=status.HTTP_400_BAD_REQUEST)


### **REGISTER VIEW**
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash password
        return super().create(validated_data)

class RegisterView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


### **USER DATA VIEW**
class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "recipes": [{"id": 1, "title": "Roasted Chicken"}, {"id": 2, "title": "Chocolate Cake"}]
        })


### **DASHBOARD VIEW**
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "recipes": [{"id": 1, "title": "Roasted Chicken"}, {"id": 2, "title": "Vegan Pasta"}],
        })


### **PASSWORD RESET REQUEST**
@method_decorator(csrf_exempt, name="dispatch")
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to request a reset

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()  # ✅ Prevent MultipleObjectsReturned error

        if not user:
            return Response({"detail": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate password reset token
        reset_token = default_token_generator.make_token(user)
        uid = user.pk
        reset_link = f"http://127.0.0.1:3000/reset-password/{uid}/{reset_token}/"


        # Send email
        try:
            send_mail(
                "Password Reset Request",
                f"Click the following link to reset your password: {reset_link}",
                "no-reply@forkinflavors.com",
                [email],
                fail_silently=False,
            )
            return Response({"detail": "Password reset email sent"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending email: {str(e)}")  # Debugging
            return Response({"detail": "Error sending reset email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
