from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer, LoginSerializer

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken




class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    
    serializer_class = RegisterSerializer  
    

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
class LogoutAPIView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {
                    "message": "Logout successfull"
                },
                status=status.HTTP_200_OK
            )
            
        except Exception:
            return Response(
                {
                    "error": "Invalid token"
                },
                status= status.HTTP_400_BAD_REQUEST
            )