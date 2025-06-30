from rest_framework import serializers
from .models import BlogPost, Comment, BlogLike
from adminside.models import BlogCategory
from adminside.serializers import CategorySerializer

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=BlogCategory.objects.all(),
        source='category',
        write_only=True
    )
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'content',
            'author',
            'image',
            'category',
            'category_id',
            'timestamp',
            'status',
            'likes_count',
            'is_liked',
        ]

    def get_author(self, obj):
        return {
            "id": obj.author.id,
            "username": obj.author.username,
            "email": obj.author.email,
        } if obj.author else None

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    def get_likes_count(self, obj):
        return BlogLike.objects.filter(blog=obj).count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user and user.is_authenticated:
            return BlogLike.objects.filter(blog=obj, user=user).exists()
        return False



class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
        
        
class BlogLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogLike
        fields = ['id', 'blog', 'user']