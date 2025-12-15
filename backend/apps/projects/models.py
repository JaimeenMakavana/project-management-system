"""
Project domain models.
"""
from django.db import models
from apps.core.models import TimeStampedModel
from apps.organizations.models import Organization


class Project(TimeStampedModel):
    """Project model - organization dependent."""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    ]
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
        ]

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

