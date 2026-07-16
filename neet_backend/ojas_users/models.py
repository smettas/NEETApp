from django.db import models
from django.contrib.auth.models import User

class StudentProfile(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    PROGRAM_CHOICES = [
        ('AADHYA', 'AADHYA'),
        ('VISHWANATHA', 'VISHWANATHA'),
        ('VAIDYANATHA', 'VAIDYANATHA'),
    ]
    CLASS_CHOICES = [
        ('10th', '10th'),
        ('PUC 1', 'PUC 1'),
        ('PUC 2', 'PUC 2'),
    ]

    # Link to Django User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Personal Info
    photo = models.ImageField(upload_to='students/photos/', blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    dob = models.DateField(blank=True, null=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True)
    father_name = models.CharField(max_length=100, blank=True)
    mother_name = models.CharField(max_length=100, blank=True)
    parent_mobile = models.CharField(max_length=10, blank=True)
    parent_occupation = models.CharField(max_length=100, blank=True)
    aadhar_number = models.CharField(max_length=12, blank=True)
    aadhar_file = models.FileField(upload_to='students/aadhar/', blank=True, null=True)

    # Contact
    mobile = models.CharField(max_length=10, blank=True)
    state = models.CharField(max_length=50, blank=True)
    district = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    pincode = models.CharField(max_length=6, blank=True)
    address = models.TextField(blank=True)

    # Academic
    school_name = models.CharField(max_length=200, blank=True)
    current_class = models.CharField(max_length=20, choices=CLASS_CHOICES, blank=True)
    board = models.CharField(max_length=20, blank=True)
    year_of_passing = models.CharField(max_length=4, blank=True)
    tenth_marks = models.CharField(max_length=10, blank=True)
    puc1_marks = models.CharField(max_length=10, blank=True)
    puc2_marks = models.CharField(max_length=10, blank=True)
    previous_coaching = models.BooleanField(default=False)
    institute_name = models.CharField(max_length=200, blank=True)
    neet_attempt_status = models.CharField(max_length=20, blank=True)
    attempt1_marks = models.CharField(max_length=10, blank=True)
    attempt2_marks = models.CharField(max_length=10, blank=True)

    # Course
    program = models.CharField(max_length=20, choices=PROGRAM_CHOICES, blank=True)
    hostel_required = models.BooleanField(default=False)

    # System
    roll_number = models.CharField(max_length=20, unique=True, blank=True)
    batch = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    require_password_change = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.program}"

    class Meta:
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'

class HomeLeaveRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='home_leave_requests')
    request_date = models.DateField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    guardian_name = models.CharField(max_length=100)
    guardian_mobile = models.CharField(max_length=10)
    guardian_relation = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.start_date} to {self.end_date} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Home Leave Request'
        verbose_name_plural = 'Home Leave Requests'

class Enquiry(models.Model):
    PROGRAM_CHOICES = [('AADHYA', 'AADHYA'), ('VISHWANATHA', 'VISHWANATHA'), ('VAIDYANATHA', 'VAIDYANATHA'), ('Not Sure', 'Not Sure')]
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    email = models.EmailField(blank=True)
    current_class = models.CharField(max_length=20, blank=True)
    program = models.CharField(max_length=20, choices=PROGRAM_CHOICES, blank=True)
    city = models.CharField(max_length=50, blank=True)
    message = models.TextField(blank=True)
    is_contacted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.name} - {self.phone} - {self.program}"
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Enquiry'
        verbose_name_plural = 'Enquiries'


class ParentVisitRequest(models.Model):
    STATUS_CHOICES = [('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')]
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='parent_visit_requests')
    visit_date = models.DateField()
    visit_time = models.CharField(max_length=20)
    parent_name = models.CharField(max_length=100)
    parent_mobile = models.CharField(max_length=10)
    relation = models.CharField(max_length=20)
    purpose = models.CharField(max_length=100)
    number_of_visitors = models.PositiveSmallIntegerField(default=1)
    visiting_message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    admin_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Parent Visit Request'
        verbose_name_plural = 'Parent Visit Requests'
    def __str__(self): return f"{self.student.user.get_full_name()} - {self.visit_date} - {self.status}"

class Notice(models.Model):
    CATEGORY_CHOICES = [('Schedule', 'Schedule'), ('Update', 'Update'), ('Notes', 'Notes'), ('Announcement', 'Announcement')]
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Announcement')
    message = models.TextField(blank=True)
    attachment = models.FileField(upload_to='notices/', blank=True, null=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['-published_at']
    def __str__(self): return self.title