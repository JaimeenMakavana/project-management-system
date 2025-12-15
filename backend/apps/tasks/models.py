"""
Task domain models.
"""
from django.db import models
from apps.core.models import TimeStampedModel
from apps.projects.models import Project


class Task(TimeStampedModel):
    """Task model - project dependent."""
    
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TODO'
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='MEDIUM'
    )
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['project', 'priority']),
        ]

    def __str__(self):
        return f"{self.title} ({self.project.name})"


class TaskComment(TimeStampedModel):
    """Comments on tasks."""
    
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    author_email = models.EmailField()

    class Meta:
        db_table = 'task_comments'
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author_email} on {self.task.title}"

