from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status 
from rest_framework.permissions import AllowAny  # REQUIRED to fix the public login block

# Alias the model to 'LoginModel' to prevent naming conflicts with the 'Login' view class
from .serializers import LoginSerializers
from .models import Login as LoginModel 
from .permissions import IsAdmin, IsUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Please provide both username and password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "This account has been deactivated."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        user_role = (
            "admin"
            if (user.is_superuser or getattr(user, "is_staff", False))
            else getattr(user, "role", "user")
        )

        response = Response(
            {
                "role": user_role,
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": getattr(user, "phone", ""),
            },
            status=status.HTTP_200_OK,
        )

        # HttpOnly Access Token Cookie
        response.set_cookie(
            key="access_token",
            value=str(access),
            httponly=True,
            secure=False,          # Change to True in production (HTTPS)
            samesite="Lax",
            max_age=60 * 10,
        )

        # HttpOnly Refresh Token Cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,          # Change to True in production (HTTPS)
            samesite="Lax",
            max_age=60 * 60 * 24 * 3,
        )

        return response
    
class Logout(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response(
            {"message": "Logged out successfully"},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class CreateUser(APIView):
    permission_classes = [IsAdmin]
    
    def post(self, request):
        data1 = request.data
        Sz = LoginSerializers(data=data1)
        if Sz.is_valid():
            Sz.save()
            return Response({"success": "data been inserted"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "invalid data format", "details": Sz.errors}, status=status.HTTP_400_BAD_REQUEST)
        

class GetUser(APIView):
    permission_classes = [IsAdmin] # Protect list view so only admins can retrieve all users

    def get(self, request):
        data1 = LoginModel.objects.all()
        Sz = LoginSerializers(data1, many=True)
        return Response({"users": Sz.data})
         

class GetUserById(APIView):
    # To avoid the 'AND' bottleneck where a user must be both, we allow either to pass.
    # If your custom permission classes do not support OR checks natively, you can temporarily
    # use a single permission class or a custom combined one.
    permission_classes = [IsUser | IsAdmin] 
    
    def get(self, request, id):
        try:
            data1 = LoginModel.objects.get(id=id)
            Sz = LoginSerializers(data1)
            return Response({"user data": Sz.data})
        except LoginModel.DoesNotExist:
            return Response({"error": "User record not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateUser(APIView):
    permission_classes = [IsAdmin|IsUser]
     
    def put(self, request, id):    
        try:
            user = LoginModel.objects.get(id=id)
            data1 = request.data
            Sz = LoginSerializers(user, data=data1,partial=True)

            if Sz.is_valid():
                Sz.save()
                return Response({"data": "data is updated fully"})
            else:
                return Response({"error": "invalid data format", "details": Sz.errors}, status=status.HTTP_400_BAD_REQUEST)
        except LoginModel.DoesNotExist:
            return Response({"error": "User record not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try:
            user = LoginModel.objects.get(id=id)
            data1 = request.data
            Sz = LoginSerializers(user, data=data1, partial=True)

            if Sz.is_valid():
                Sz.save()
                return Response({"data": "data is updated partially"})
            else:
                return Response({"error": "invalid data format", "details": Sz.errors}, status=status.HTTP_400_BAD_REQUEST)
        except LoginModel.DoesNotExist:
            return Response({"error": "User record not found"}, status=status.HTTP_404_NOT_FOUND)