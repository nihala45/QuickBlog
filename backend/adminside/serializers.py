from rest_framework import serializers
from adminside.models import BlogCategory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'