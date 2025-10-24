# from django.contrib import admin
# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenRefreshView
# from authenixApp.views import CustomTokenObtainPairView, Verify2FAView, UserViewSet
# from rest_framework import routers

# router = routers.DefaultRouter()
# router.register('users', UserViewSet)

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path("api/v1/", include(router.urls)),
#     path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
# ]




# urls.py
from django.contrib import admin
from authenixApp.views import PasswordResetRequestView, PasswordResetConfirmView

from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from authenixApp.views import (
    CustomTokenObtainPairView, Verify2FAView, UserViewSet, RoleViewSet,CompanyViewSet,
    Login2FAView, GetCSRFToken,CookieTokenRefreshView, LogoutView, ConfirmEmailView
)
from rest_framework import routers
from authenixApp.views import ResendVerificationEmailView

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('roles', RoleViewSet)
router.register('companies', CompanyViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/", include(router.urls)),
    
    # Autenticação
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/', Login2FAView.as_view(), name='login_2fa'),
    path('api/verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/get-csrf-token/', GetCSRFToken.as_view(), name='GetCSRFToken'),
    path('api/logout/', LogoutView.as_view(), name='logOut'),
    
    # Registro e verificação
    path('api/register/', UserViewSet.as_view({'post': 'register'}), name='register'),
    path('api/verify-email/', UserViewSet.as_view({'post': 'verify_email'}), name='verify_email'),
    path('api/resend-registration-code/', UserViewSet.as_view({'post': 'resend_registration_code'}), name='resend_registration_code'),
    path('api/me/', UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('api/confirm-email/<uuid:token>/', ConfirmEmailView.as_view(), name='confirm_email'),
    path('api/password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

]



