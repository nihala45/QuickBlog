from django.db import models
from account.models import Users
from adminside.models import BlogCategory
from ckeditor.fields import RichTextField
from account.models import Users

class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=255)
    content = RichTextField()   
    author = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name='blog_posts'
    )

    image = models.ImageField(
        upload_to='blog_images/', 
        null=True, 
        blank=True
    )
   
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='blog_posts'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )

    def __str__(self):
        return self.title


class Comment(models.Model):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Comment by {self.user.username}'
    
    
class BlogLike(models.Model):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('blog', 'user')