from django.db import models
from django.contrib.auth.models import AbstractUser

class Login(AbstractUser):
    roles=(
        ("admin","Admin"),
        ("user","User"),
    )

    role=models.CharField(max_length=20 ,choices=roles,default="user")
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} (ID: {self.id})"