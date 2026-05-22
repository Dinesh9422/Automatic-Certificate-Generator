from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import AdminUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id':           user.id,
            'username':     user.username,
            'email':        user.email,
            'role':         user.role,
            'organization': user.organization,
            'mode':         user.mode,
        }
        return data


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AdminUser
        fields = ['id', 'username', 'email', 'role', 'organization', 'department', 'phone', 'mode', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password     = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('New passwords do not match.')
        return data
