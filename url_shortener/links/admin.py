from django.contrib import admin
from .models import Links

admin.site.register(Links)  
admin.site.login_url = '/admin/login/'  # Ensure the admin login URL is set correctly