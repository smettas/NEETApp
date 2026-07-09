from django.db import models

class MockTest(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
        ('Expert', 'Expert'),
    ]
    TEST_TYPE_CHOICES = [
        ('Chapter', 'Chapter Test'),
        ('Unit', 'Unit Test'),
        ('Full', 'Full Mock Test'),
        ('Grand', 'Grand Mock Test'),
    ]
    title = models.CharField(max_length=200)
    test_type = models.CharField(max_length=20, choices=TEST_TYPE_CHOICES)
    subject = models.CharField(max_length=50, blank=True)
    total_questions = models.IntegerField(default=45)
    total_marks = models.IntegerField(default=180)
    duration_minutes = models.IntegerField(default=60)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Medium')
    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1)
    explanation = models.TextField(blank=True)
    marks = models.IntegerField(default=4)
    negative_marks = models.FloatField(default=1.0)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}"

    class Meta:
        ordering = ['order']

class TestResult(models.Model):
    student = models.ForeignKey('ojas_users.StudentProfile', on_delete=models.CASCADE)
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_marks = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    wrong_answers = models.IntegerField(default=0)
    skipped = models.IntegerField(default=0)
    time_taken = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    def percentage(self):
        return round((self.score / self.total_marks) * 100, 2) if self.total_marks > 0 else 0

    def __str__(self):
        return f"{self.student} - {self.test} - {self.score}"

    class Meta:
        ordering = ['-completed_at']