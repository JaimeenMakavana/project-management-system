"""
GraphQL queries for tasks.
"""
import graphene
from apps.tasks.models import Task, TaskComment
from apps.tasks.services import TaskService, TaskCommentService
from .types import TaskType, TaskCommentType


class TaskQuery(graphene.ObjectType):
    """Task queries."""
    
    # List all tasks (optionally filtered)
    tasks = graphene.List(
        TaskType,
        project_id=graphene.Int(),
        organization_id=graphene.Int(),
        status=graphene.String(),
        assignee_email=graphene.String(),
        description="Get all tasks, optionally filtered"
    )
    
    # Get single task by ID
    task = graphene.Field(
        TaskType,
        id=graphene.Int(required=True),
        description="Get a specific task by ID"
    )
    
    # Get tasks for a specific project
    tasks_by_project = graphene.List(
        TaskType,
        project_id=graphene.Int(required=True),
        status=graphene.String(),
        assignee_email=graphene.String(),
        description="Get all tasks for a project"
    )
    
    # Get tasks for an organization
    tasks_by_organization = graphene.List(
        TaskType,
        organization_id=graphene.Int(required=True),
        status=graphene.String(),
        description="Get all tasks for an organization"
    )
    
    # Get comments for a task
    task_comments = graphene.List(
        TaskCommentType,
        task_id=graphene.Int(required=True),
        description="Get all comments for a task"
    )
    
    def resolve_tasks(self, info, project_id=None, organization_id=None, status=None, assignee_email=None):
        """Resolve all tasks with optional filters."""
        queryset = Task.objects.select_related('project', 'project__organization').all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if organization_id:
            queryset = queryset.filter(project__organization_id=organization_id)
        
        if status:
            queryset = queryset.filter(status=status)
        
        if assignee_email:
            queryset = queryset.filter(assignee_email=assignee_email)
        
        return queryset
    
    def resolve_task(self, info, id):
        """Resolve single task by ID."""
        try:
            return Task.objects.select_related('project', 'project__organization').get(id=id)
        except Task.DoesNotExist:
            return None
    
    def resolve_tasks_by_project(self, info, project_id, status=None, assignee_email=None):
        """Resolve tasks for a specific project."""
        return TaskService.get_tasks_by_project(project_id, status, assignee_email)
    
    def resolve_tasks_by_organization(self, info, organization_id, status=None):
        """Resolve tasks for a specific organization."""
        return TaskService.get_tasks_by_organization(organization_id, status)
    
    def resolve_task_comments(self, info, task_id):
        """Resolve comments for a specific task."""
        return TaskCommentService.get_comments_by_task(task_id)

