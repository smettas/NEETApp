from django.contrib import admin
from .models import StudentProfile, Enquiry, HomeLeaveRequest, ParentVisitRequest, Notice

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    # Only show fields that are filled during registration
    fieldsets = (
        ('User Account', {
            'fields': ('user',)
        }),
        ('Registration Fields - Auto Filled', {
            'fields': ('roll_number', 'mobile', 'first_name_display', 'last_name_display', 'batch', 'created_at'),
            'description': 'These fields are automatically filled during registration'
        }),
        ('Personal Information - From Registration', {
            'fields': ('gender', 'blood_group', 'address', 'current_class'),
        }),
        ('Password Management', {
            'fields': ('require_password_change',),
            'description': 'Check this box if user logged in with temporary password and must change it on next login'
        }),
    )
    
    list_display = ['user', 'roll_number', 'mobile', 'gender', 'batch', 'require_password_change', 'created_at']
    list_filter = ['batch', 'current_class', 'gender', 'require_password_change']
    search_fields = ['user__first_name', 'user__last_name', 'mobile', 'roll_number']
    readonly_fields = ('created_at', 'first_name_display', 'last_name_display')
    
    def first_name_display(self, obj):
        return obj.user.first_name
    first_name_display.short_description = 'First Name'
    
    def last_name_display(self, obj):
        return obj.user.last_name
    last_name_display.short_description = 'Last Name'
    
    def get_fields(self, request, obj=None):
        # Show only fields we want to see
        return [
            'user', 'roll_number', 'mobile', 'first_name_display', 'last_name_display',
            'gender', 'blood_group', 'current_class', 'address', 'batch', 'require_password_change', 'created_at'
        ]

@admin.register(HomeLeaveRequest)
class HomeLeaveRequestAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Student & Request Info', {
            'fields': ('student', 'start_date', 'end_date', 'request_date')
        }),
        ('Guardian Details', {
            'fields': ('guardian_name', 'guardian_mobile', 'guardian_relation')
        }),
        ('Reason', {
            'fields': ('reason',)
        }),
        ('Status & Admin Action', {
            'fields': ('status', 'admin_comment'),
            'description': 'Update status to Approved or Rejected. Add optional comment for student.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_display = ['get_student_name', 'start_date', 'end_date', 'status', 'get_days', 'created_at']
    list_filter = ['status', 'created_at', 'start_date']
    list_editable = ['status']
    search_fields = ['student__user__first_name', 'student__user__last_name', 'student__mobile', 'student__roll_number']
    readonly_fields = ('created_at', 'updated_at', 'request_date')
    date_hierarchy = 'start_date'
    
    actions = ['approve_requests', 'reject_requests']
    
    def get_student_name(self, obj):
        return f"{obj.student.user.get_full_name()} ({obj.student.roll_number})"
    get_student_name.short_description = 'Student'
    
    def get_days(self, obj):
        days = (obj.end_date - obj.start_date).days + 1
        return f"{days} days"
    get_days.short_description = 'Duration'
    
    def approve_requests(self, request, queryset):
        updated = queryset.update(status='Approved')
        self.message_user(request, f'{updated} request(s) approved.')
    approve_requests.short_description = "✅ Approve selected requests"
    
    def reject_requests(self, request, queryset):
        updated = queryset.update(status='Rejected')
        self.message_user(request, f'{updated} request(s) rejected.')
    reject_requests.short_description = "❌ Reject selected requests"


@admin.register(ParentVisitRequest)
class ParentVisitRequestAdmin(admin.ModelAdmin):
    list_display = [
        'student',
        'visit_date',
        'visit_time',
        'parent_name',
        'relation',
        'purpose',
        'status',
        'created_at'
    ]

    list_filter = [
        'status',
        'visit_date',
        'relation',
        'purpose'
    ]

    list_editable = ['status']

    search_fields = [
        'student__user__first_name',
        'student__roll_number',
        'parent_name',
        'parent_mobile'
    ]

    readonly_fields = [
        'created_at',
        'updated_at'
    ]

    actions = ['approve_requests', 'reject_requests']

    @admin.action(description='Approve selected parent visit requests')
    def approve_requests(self, request, queryset):
        queryset.update(status='Approved')

    @admin.action(description='Reject selected parent visit requests')
    def reject_requests(self, request, queryset):
        queryset.update(status='Rejected')
@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'program', 'city', 'is_contacted', 'created_at']
    list_filter = ['program', 'is_contacted', 'created_at']
    search_fields = ['name', 'phone', 'email']
    list_editable = ['is_contacted']

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_at']
    list_filter = ['category', 'published_at']
    search_fields = ['title', 'message']
