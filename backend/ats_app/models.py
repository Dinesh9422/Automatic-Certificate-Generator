# ats_app/models.py
from django.db import models
from django.conf import settings


class ATSAnalysis(models.Model):
    resume_file    = models.FileField(upload_to='resumes/')
    job_role       = models.CharField(max_length=200)
    job_description = models.TextField(blank=True)
    overall_score  = models.FloatField(default=0)
    skills_score   = models.FloatField(default=0)
    experience_score = models.FloatField(default=0)
    education_score  = models.FloatField(default=0)
    keyword_score    = models.FloatField(default=0)
    matched_keywords = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)
    extracted_skills = models.JSONField(default=list)
    suggestions      = models.JSONField(default=list)
    analyzed_by      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ats_analyses'
        ordering = ['-created_at']

    def __str__(self):
        return f"ATS #{self.id} — {self.job_role} ({self.overall_score:.0f}%)"
