from authenixApp.serializers import UserSerializer, RoleSerializer
from authenixApp.models import User, Role
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action

from .serializers import (
     UserRegistrationSerializer, UserUpdateSerializer, 
    
)
from .permissions import IsAdmin, CanCreateUser, CanModifyUser
from django.core.mail import send_mail
from django.conf import settings

from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_protect



class CustomTokenRefreshView(TokenRefreshView):
    """Refresh token protegido com CSRF"""
    
    @method_decorator(ensure_csrf_cookie)
    def post(self, request, *args, **kwargs):
        # Esta view vai requerer CSRF token porque usa cookie
        return super().post(request, *args, **kwargs)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    @method_decorator(csrf_protect)
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh") or request.COOKIES.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({
                "detail": "Logout realizado com sucesso."
            }, status=status.HTTP_200_OK)
            
            # Limpar o cookie
            response.delete_cookie('refresh_token')
            response.delete_cookie('csrftoken')
            
            return response
            
        except Exception as e:
            return Response({
                "detail": "Erro durante o logout."
            }, status=status.HTTP_400_BAD_REQUEST)

# View para obter CSRF token (usada pelo frontend)
class GetCSRFToken(APIView):
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({
            "detail": "CSRF cookie set"
        })



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
        if self.action in ['register', 'verify_email', 'resend_registration_code']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Registro público de novos usuários"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Gerar código de confirmação de registro (4 dígitos)
            registration_code = user.generate_code(isTwoFactor=False)
            
            # Enviar e-mail de verificação
            self.send_registration_email(user, registration_code)
            
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

        # Usar verify_code com isTwoFactor=False para verificação de registro
        if user.verify_code(code, isTwoFactor=False):
            return Response({
                "detail": "E-mail verificado com sucesso. Sua conta está ativa.",
                "next": "/login"
            })

        return Response({"detail": "Código inválido ou expirado."}, 
                      status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def resend_registration_code(self, request):
        """Reenvia código de confirmação de registro"""
        email = request.data.get("email")
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        if user.is_email_verified:
            return Response({
                "detail": "E-mail já verificado. Você pode fazer login normalmente."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Gerar novo código de registro (4 dígitos)
        registration_code = user.generate_code(isTwoFactor=False)
        self.send_registration_email(user, registration_code)
        
        return Response({
            "detail": "Código de verificação reenviado para seu e-mail.",
            "user_id": user.id,
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Retorna dados do usuário logado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def send_registration_email(self, user, code):
        """Enviar e-mail de verificação de registro"""
        subject = "Ative sua conta - Código de Verificação"
        message = f"""
        Olá {user.username},
        
        Bem-vindo ao nosso sistema! 
        Seu código de ativação é: {code}
        
        Use este código para ativar sua conta. Ele expira em 10 minutos.
        
        Atenciosamente,
        Equipe do Sistema
        """
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
            # Reenviar código de verificação de registro
            registration_code = user.generate_code(isTwoFactor=False)
            self.send_registration_email(user, registration_code)
            
            return Response({
                "detail": "E-mail não verificado. Um novo código de verificação foi enviado para seu e-mail.",
                "next": "/verify-email",
                "user_id": user.id,
                
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar se a conta está ativa
        if not user.is_active:
            return Response({
                "detail": "Sua conta está desativada. Entre em contato com o administrador.",
               
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Se e-mail está verificado, prosseguir com 2FA para login (6 dígitos)
        two_factor_code = user.generate_code(isTwoFactor=True)
        user.send_code()  # Usa o método send_code do modelo para 2FA

        return Response({
            "detail": "Código de verificação (2FA) enviado para seu e-mail.",
            "next": "/two-factor",
            "user_id": user.id,
           
            
        }, status=status.HTTP_200_OK)

    def send_registration_email(self, user, code):
        """Enviar e-mail de verificação de conta"""
        subject = "Ative sua conta - Código de Verificação"
        message = f"""
        Olá {user.username},
        
        Foi solicitado um novo código de ativação para sua conta.
        Seu código é: {code}
        
        Use este código para ativar sua conta. Ele expira em 10 minutos.
        
        Atenciosamente,
        Equipe do Sistema
        """
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )




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
            return Response({"detail": "Email ou senha inválido."}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se o e-mail está verificado
        if not user.is_email_verified:
            # Reenviar código de verificação de registro (4 dígitos)
            registration_code = user.generate_code(isTwoFactor=False)
            self.send_registration_email(user, registration_code)
            
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

        # Gerar código 2FA para login (6 dígitos)
        two_factor_code = user.generate_code(isTwoFactor=True)
        user.send_code()  # Usa o método do modelo
        
        return Response({
            "detail": "Código de verificação (2FA) enviado para o e-mail cadastrado.",
            "user_id": user.id
        }, status=status.HTTP_200_OK)

    def send_registration_email(self, user, code):
        """Enviar e-mail de verificação de conta"""
        subject = "Ative sua conta - Código de Verificação"
        message = f"""
        Olá {user.username},
        
        Foi solicitado um novo código de ativação para sua conta.
        Seu código é: {code}
        
        Use este código para ativar sua conta. Ele expira em 10 minutos.
        
        Atenciosamente,
        Equipe do Sistema
        """
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )


class Verify2FAView(APIView):
    """2ª Etapa — Valida código 2FA e retorna tokens JWT."""
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Usar verify_code com isTwoFactor=True para verificação 2FA
        if user.verify_code(code, isTwoFactor=True):
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                "detail": "Verificação 2FA bem-sucedida.",
                "access": str(refresh.access_token),
                # "refresh": str(refresh),
            })
            response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,     # 🔒 JS não pode ler
            secure=False,      # use True em produção (HTTPS)
            samesite='Strict', # protege contra CSRF
            max_age=7 * 24 * 60 * 60  # (opcional) validade de 7 dias
        )
            return response

        return Response({"detail": "Código 2FA inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationEmailView(APIView):
    """Reenvia o código de verificação de e-mail (registro)"""
    
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
        
        # Gerar novo código de verificação de registro (4 dígitos)
        registration_code = user.generate_code(isTwoFactor=False)
        
        # Enviar e-mail
        self.send_registration_email(user, registration_code)
        
        return Response({
            "detail": "Código de verificação reenviado para seu e-mail.",
            "user_id": user.id,
        }, status=status.HTTP_200_OK)

    def send_registration_email(self, user, code):
        """Enviar e-mail de verificação de registro"""
        subject = "Ative sua conta - Código de Verificação"
        message = f"""
        Olá {user.username},
        
        Foi solicitado um novo código de ativação para sua conta.
        Seu código é: {code}
        
        Use este código para ativar sua conta. Ele expira em 10 minutos.
        
        Atenciosamente,
        Equipe do Sistema
        """
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        

# views.py - no UserViewSet
@action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
def me(self, request):
    """Retorna dados do usuário logado"""
    serializer = self.get_serializer(request.user)
    return Response(serializer.data)