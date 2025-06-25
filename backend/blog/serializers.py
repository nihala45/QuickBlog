from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already exists.")]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Username already exists.")]
    )
    phone = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Phone number already exists.")]
    )
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'phone', 'password',
            'is_active', 'is_superuser', 'is_staff'
        )
        extra_kwargs = {
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
        }

    def validate(self, data):
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user