from authenixApp.serializers import UserSerializer, RoleSerializer
from authenixApp.models import User
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from authenixApp.utils.utils import send_two_factor_code


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoleViewSet(viewsets.ModelViewSet):
    queryset = User.role.field.related_model.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.user
        user.generate_two_factor_code()
        send_two_factor_code(user)

        return Response({
            "detail": "Código de verificação enviado para seu e-mail.",
            "next": "/two-factor",
            "user_id": user.id,
        }, status=status.HTTP_200_OK)


class Login2FAView(APIView):
    """1ª Etapa — Autentica credenciais e envia código por e-mail."""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_400_BAD_REQUEST)

        user.generate_two_factor_code()
        send_two_factor_code(user)
        return Response({"detail": "Código de verificação enviado para o e-mail cadastrado."}, status=status.HTTP_200_OK)


class Verify2FAView(APIView):
    """2ª Etapa — Valida código e retorna tokens JWT."""
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if user.verify_two_factor_code(code):
            refresh = RefreshToken.for_user(user)
            return Response({
                "detail": "Verificação bem-sucedida.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        return Response({"detail": "Código inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
