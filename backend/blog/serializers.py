from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'content',
            'author',
            'image',
            'category',
            'timestamp',
            'status',
        ]

    def get_author(self, obj):
        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "email": obj.author.email,
        } if obj.author else None

