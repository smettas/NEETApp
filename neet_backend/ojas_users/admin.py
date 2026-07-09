from django.contrib import admin
from .models import StudentProfile, Enquiry

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'program', 'mobile', 'city', 'batch', 'created_at']
    list_filter = ['program', 'batch', 'current_class']
    search_fields = ['user__first_name', 'user__email', 'mobile', 'roll_number']

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'program', 'city', 'is_contacted', 'created_at']
    list_filter = ['program', 'is_contacted', 'created_at']
    search_fields = ['name', 'phone', 'email']
    list_editable = ['is_contacted']