
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

       
        return obj.author == request.user
    
    
    

class IsAuthorOrAdminDeleteOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == 'DELETE':
            return obj.author == request.user or request.user.is_superuser

        # For PUT, PATCH (editing), only author is allowed
        return obj.author == request.user