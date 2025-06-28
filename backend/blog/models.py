from django.db import models
from account.models import Users
from adminside.models import BlogCategory
from ckeditor.fields import RichTextField

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
