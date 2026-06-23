from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(
        write_only = True,
        min_length = 8
    )
    
    class Meta:
        model = User
        
        fields = [
            "username",
            "email",
            "phone",
            "password",
            "role"
        ]
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        return user
    
    
class LoginSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token =  super().get_token(user)
    
        token["username"] = user.username
        token["role"] = user.role
        
        return token
    
    def validate(self, attrs):
        data =  super().validate(attrs)
        
        data["user"] = {
            "id" : self.user.id,
            "username" : self.user.username,
            "email" : self.user.email,
            "phone" : self.user.phone,
            "role" : self.user.role,
        }
        return data
    
    