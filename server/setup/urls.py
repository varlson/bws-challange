from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from authenixApp.views import CustomTokenObtainPairView, Verify2FAView, UserViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/", include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/verify-2fa/', Verify2FAView.as_view(), name='verify_2fa'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
