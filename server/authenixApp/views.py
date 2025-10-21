from authenixApp.serializers import UserSerializer, RoleSerializer
from authenixApp.models import User, Role
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from authenixApp.utils.utils import send_two_factor_code
from rest_framework.decorators import action



from .serializers import (
     UserRegistrationSerializer, UserUpdateSerializer, 
    
)
from .permissions import IsAdmin, CanCreateUser, CanModifyUser



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, CanCreateUser, CanModifyUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Registro público de novos usuários"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Gerar código 2FA para verificação de e-mail
            verification_code = user.generate_two_factor_code()
            
            # Enviar e-mail de verificação
            self.send_verification_email(user, verification_code)
            
            return Response({
                "detail": "Conta criada com sucesso. Verifique seu e-mail para ativar sua conta.",
                "user_id": user.id,
                "next": "/verify-email"
            }, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def verify_email(self, request):
        """Verificação de e-mail para usuários recém-registrados"""
        email = request.data.get("email")
        code = request.data.get("code")
        
        print(f'Verifying email for {email} with code {code}')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, 
                        status=status.HTTP_404_NOT_FOUND)

        if user.verify_two_factor_code(code):
            user.is_email_verified = True
            user.save()
            
            return Response({
                "detail": "E-mail verificado com sucesso. Sua conta está ativa.",
                "next": "/login"
            })

        return Response({"detail": "Código inválido ou expirado."}, 
                  status=status.HTTP_400_BAD_REQUEST)

    def send_verification_email(self, user, code):
        """Enviar e-mail de verificação de conta"""
        subject = "Verifique sua conta"
        message = f"""
        Olá {user.username},

        Bem-vindo ao nosso sistema! 
        Seu código de verificação é: {code}

        Use este código para ativar sua conta. Ele expira em 5 minutos.

        Atenciosamente,
        Equipe do Sistema
        """
        from django.core.mail import send_mail
        from django.conf import settings
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )




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
        
        # Verificar se o e-mail está verificado
        if not user.is_email_verified:
            # Se não estiver verificado, reenviar código de verificação
            user.generate_two_factor_code()
            send_two_factor_code(user)
            
            return Response({
                "detail": "E-mail não verificado. Um novo código de verificação foi enviado para seu e-mail.",
                "next": "/verify-email",
                "user_id": user.id,
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar se a conta está ativa
        if not user.is_active:
            return Response({
                "detail": "Sua conta está desativada. Entre em contato com o administrador."
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Se e-mail está verificado, prosseguir com 2FA para login
        user.generate_two_factor_code()
        send_two_factor_code(user)

        return Response({
            "detail": "Código de verificação enviado para seu e-mail.",
            "next": "/two-factor",
            "user_id": user.id,
        }, status=status.HTTP_200_OK)

    def send_verification_email(self, user, code):
        """Método para enviar e-mail de verificação de conta"""
        # Implemente o envio de e-mail aqui
        print(f"Enviando código de verificação de e-mail: {code} para {user.email}")
        # TODO: Implementar envio real de e-mail
        pass



class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]




class Login2FAView(APIView):
    """1ª Etapa — Autentica credenciais e envia código por e-mail."""
    
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"detail": "Credenciais inválidas."}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se o e-mail está verificado
        if not user.is_email_verified:
            # Reenviar código de verificação de e-mail
            verification_code = user.generate_two_factor_code()
            print(f'user ${user.email} not verified, resending code {verification_code}')
            send_two_factor_code(user)
            
            return Response({
                "detail": "E-mail não verificado. Um novo código de verificação foi enviado.",
                "next": "/verify-email",
                "user_id": user.id,
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar se conta está ativa
        if not user.is_active:
            return Response({
                "detail": "Conta desativada. Contate o administrador."
            }, status=status.HTTP_403_FORBIDDEN)

        # Gerar código 2FA para login
        user.generate_two_factor_code()
        send_two_factor_code(user)
        
        return Response({
            "detail": "Código de verificação enviado para o e-mail cadastrado.",
            "user_id": user.id
        }, status=status.HTTP_200_OK)

    def send_verification_email(self, user, code):
        """Enviar e-mail de verificação de conta"""
        # Implemente o envio de e-mail aqui
        print(f"Enviando código de verificação de e-mail: {code} para {user.email}")
        # TODO: Implementar envio real de e-mail
        pass



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


class ResendVerificationEmailView(APIView):
    """Reenvia o código de verificação de e-mail"""
    
    def post(self, request):
        email = request.data.get("email")
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Se o e-mail já está verificado, não precisa reenviar
        if user.is_email_verified:
            return Response({
                "detail": "E-mail já verificado. Você pode fazer login normalmente."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Gerar novo código de verificação
        verification_code = user.generate_two_factor_code()
        
        # Enviar e-mail
        self.send_verification_email(user, verification_code)
        
        return Response({
            "detail": "Código de verificação reenviado para seu e-mail.",
            "user_id": user.id,
        }, status=status.HTTP_200_OK)

    def send_verification_email(self, user, code):
        send_two_factor_code(user)
        

# views.py - no UserViewSet
@action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
def me(self, request):
    """Retorna dados do usuário logado"""
    serializer = self.get_serializer(request.user)
    return Response(serializer.data)