from django.shortcuts import render
from account.models import Users
# Create your views here.


from django.http import HttpResponse

def blog_home(request):
    return HttpResponse("Hello from Blog Home!")