# permissions.py
from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role and 
                   request.user.role.access_level == 'SUPER_ADMIN')

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role and 
                   request.user.role.access_level in ['SUPER_ADMIN', 'ADMIN'])

class IsManagerOrAbove(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role and 
                   request.user.role.access_level in ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])

class CanCreateUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return IsAdmin().has_permission(request, view)
        return True

class CanModifyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return IsAdmin().has_permission(request, view)
        return True