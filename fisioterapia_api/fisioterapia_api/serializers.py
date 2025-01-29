from dj_rest_auth.serializers import LoginSerializer as DefaultLoginSerializer
from rest_framework import serializers

class CustomLoginSerializer(DefaultLoginSerializer):
    username = None
    email = serializers.EmailField(required=True)