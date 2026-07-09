from django.db import models

class Subject(models.Model):
    SUBJECT_CHOICES = [
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'),
        ('Biology', 'Biology'),
        ('Mathematics', 'Mathematics'),
    ]
    name = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    icon = models.CharField(max_length=10, default='📚')
    color = models.CharField(max_length=20, default='#EBF3FF')
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']

class Chapter(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')
    name = models.CharField(max_length=200)
    order = models.IntegerField(default=0)
    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.subject.name} - {self.name}"

    class Meta:
        ordering = ['order']

class VideoLecture(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    youtube_url = models.URLField(blank=True)
    vdocipher_id = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=20, blank=True)
    order = models.IntegerField(default=0)
    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']

class PDFNote(models.Model):
    PDF_TYPE_CHOICES = [
        ('Notes', 'Notes'),
        ('Formula', 'Formula Sheet'),
        ('PYQ', 'Previous Year Questions'),
        ('Practice', 'Practice Set'),
        ('Diagram', 'Diagram Book'),
    ]
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='pdfs')
    title = models.CharField(max_length=200)
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    pdf_url = models.URLField(blank=True)
    pdf_type = models.CharField(max_length=20, choices=PDF_TYPE_CHOICES, default='Notes')
    pages = models.IntegerField(default=0)
    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class StudentVideoProgress(models.Model):
    student = models.ForeignKey('ojas_users.StudentProfile', on_delete=models.CASCADE)
    video = models.ForeignKey(VideoLecture, on_delete=models.CASCADE)
    watched_percent = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_watched = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'video']