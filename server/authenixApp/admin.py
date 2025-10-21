from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Company, User, Role


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'cnpj', 'domain', 'is_active', 'created_at')
    search_fields = ('name', 'cnpj', 'domain')
    list_filter = ('is_active', 'created_at')


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'username')


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'


class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = (
        'id', 'username', 'email', 'role', 'company',
        'is_active', 'is_email_verified', 'created_at'
    )
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'is_email_verified', 'role__access_level', 'company__name')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name', 'phone', 'profile_picture')}),
        ('Empresa e Papel', {'fields': ('company', 'role')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Verificações', {'fields': ('is_email_verified', 'is_two_factor_verified')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
        ('Informações Adicionais', {
            'fields': ('company', 'role', 'is_active', 'is_staff'),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    ordering = ('-created_at',)


class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'access_level')
    search_fields = ('name', 'description')
    list_filter = ('access_level',)


admin.site.register(Company, CompanyAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Role, RoleAdmin)
