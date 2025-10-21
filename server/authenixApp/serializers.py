from authenixApp.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'company', 'role',
            'phone', 'profile_picture', 'is_active', 'is_email_verified',
            'created_at', 'updated_at'
        ]

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


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User.role.field.related_model
        fields = ['id', 'name', 'description', 'access_level']
