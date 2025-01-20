from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, LogoutView, RegisterView, UserDataView, set_csrf_cookie
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user-data/', UserDataView.as_view(), name='user-data'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Correct import and path
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('csrf/', set_csrf_cookie, name='set-csrf-cookie'),

]
