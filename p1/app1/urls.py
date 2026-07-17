from django.urls import path

from .views import CreateUser,GetUser,GetUserById,UpdateUser,Login,Logout
from rest_framework_simplejwt.views import(TokenObtainPairView,TokenRefreshView)
urlpatterns=[
    path("login/",Login.as_view()),
     path("logout/",Logout.as_view()),
    
    
   
    #admin
    path("create/",CreateUser.as_view()),
    path("users/",GetUser.as_view()),
    path("userdata/<int:id>/",GetUserById.as_view()),
    path("update/<int:id>/",UpdateUser.as_view()),

    #user
    path("users/",GetUser.as_view()),

    
    
]