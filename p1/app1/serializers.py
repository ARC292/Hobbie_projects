from rest_framework import serializers
from .models import Login

class LoginSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Login
        fields = "__all__"

    def create(self, validated_data):
        user = Login(**validated_data)
        user.set_password(validated_data["password"])  # Hash the password
        user.save()
        return user