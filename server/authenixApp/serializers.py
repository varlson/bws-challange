from authenixApp.models import User,  Company, Role

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
  

    class Meta:
        model = User
        fields = [
            "first_name", "last_name",'id', 'username', 'email', 'password', 'company', 'role',
            'phone', 'profile_picture',  
            'created_at', 'updated_at', 
        ]
        extra_kwargs  = {
            'first_name':{'required':True}
        }
        
        read_only_fields = ['id', 'role']
        

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    
# serializers.py
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirmation = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)  # ← Adicione esta linha
    last_name = serializers.CharField(required=True)  
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'id', 'username', 'email', 'password', 'password_confirmation',
             'phone', 
        ]
        read_only_fields = ['id', 'is_active', 'is_email_verified', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirmation'):
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        
        # Garantir que novo usuário não tenha e-mail verificado
        user.is_email_verified = False
        
        # Obter role USER
        try:
            user_role = Role.objects.get(access_level=Role.AccessLevel.USER)
        except Role.DoesNotExist:
            user_role = Role.objects.create(
                name='User',
                description='Usuário padrão',
                access_level=Role.AccessLevel.USER
            )
        
        user.role = user_role
        user.save()
        return user


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User.role.field.related_model
        fields = ['id', 'name', 'description', 'access_level']




class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'cnpj', 'domain', 'corporate_email']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'profile_picture', 'company', 'role'
        ]