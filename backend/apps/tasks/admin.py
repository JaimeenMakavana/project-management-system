"""
Admin configuration for tasks.
"""
from django.contrib import admin
from .models import Task, TaskComment


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'assignee_email', 'due_date', 'created_at']
    list_filter = ['status', 'project__organization']
    search_fields = ['title', 'description', 'assignee_email']
    date_hierarchy = 'created_at'


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'created_at']
    search_fields = ['content', 'author_email']
    date_hierarchy = 'created_at'

