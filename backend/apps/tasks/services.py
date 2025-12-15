"""
Business logic for task operations.
"""
from datetime import datetime
from typing import Optional
from django.db import transaction
from apps.core.exceptions import OrganizationMismatchError, InvalidStatusTransitionError
from .models import Task, TaskComment
from apps.projects.models import Project


class TaskService:
    """Service class for task-related business logic."""
    
    # Valid status transitions
    VALID_TRANSITIONS = {
        'TODO': ['IN_PROGRESS', 'DONE'],
        'IN_PROGRESS': ['TODO', 'DONE'],
        'DONE': ['TODO', 'IN_PROGRESS'],
    }
    
    @staticmethod
    def create_task(
        project_id: int,
        title: str,
        description: str = "",
        status: str = "TODO",
        priority: str = "MEDIUM",
        assignee_email: str = "",
        due_date: datetime = None,
        organization_id: int = None
    ) -> Task:
        """
        Create a new task for a project.
        
        Args:
            project_id: ID of the parent project
            title: Task title
            description: Task description
            status: Task status (TODO, IN_PROGRESS, DONE)
            priority: Task priority (LOW, MEDIUM, HIGH, URGENT)
            assignee_email: Email of the assignee
            due_date: Optional due date
            organization_id: Optional organization ID for validation
            
        Returns:
            Created Task instance
            
        Raises:
            OrganizationMismatchError: If project doesn't belong to organization
        """
        project = Project.objects.select_related('organization').get(id=project_id)
        
        # Validate organization ownership if provided
        if organization_id and project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Project {project_id} does not belong to organization {organization_id}"
            )
        
        task = Task.objects.create(
            project=project,
            title=title,
            description=description,
            status=status,
            priority=priority,
            assignee_email=assignee_email,
            due_date=due_date
        )
        return task
    
    @staticmethod
    def update_task(
        task_id: int,
        organization_id: int = None,
        validate_transition: bool = False,
        **kwargs
    ) -> Task:
        """
        Update a task.
        
        Args:
            task_id: ID of the task
            organization_id: Optional organization ID for validation
            validate_transition: Whether to validate status transitions
            **kwargs: Fields to update
            
        Returns:
            Updated Task instance
            
        Raises:
            OrganizationMismatchError: If task doesn't belong to organization
            InvalidStatusTransitionError: If status transition is invalid
        """
        task = Task.objects.select_related('project__organization').get(id=task_id)
        
        # Validate organization ownership if provided
        if organization_id and task.project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Task {task_id} does not belong to organization {organization_id}"
            )
        
        # Validate status transition if requested
        if validate_transition and 'status' in kwargs:
            new_status = kwargs['status']
            current_status = task.status
            
            if new_status != current_status:
                valid_next_statuses = TaskService.VALID_TRANSITIONS.get(current_status, [])
                if new_status not in valid_next_statuses:
                    raise InvalidStatusTransitionError(
                        f"Cannot transition from {current_status} to {new_status}"
                    )
        
        for field, value in kwargs.items():
            if hasattr(task, field) and field != 'project':
                setattr(task, field, value)
        
        task.save()
        return task
    
    @staticmethod
    def get_tasks_by_project(
        project_id: int,
        status: str = None,
        assignee_email: str = None
    ) -> list:
        """
        Get all tasks for a project with optional filtering.
        
        Args:
            project_id: ID of the project
            status: Optional status filter
            assignee_email: Optional assignee email filter
            
        Returns:
            QuerySet of tasks
        """
        queryset = Task.objects.filter(
            project_id=project_id
        ).select_related('project')
        
        if status:
            queryset = queryset.filter(status=status)
        
        if assignee_email:
            queryset = queryset.filter(assignee_email=assignee_email)
        
        return queryset
    
    @staticmethod
    def get_tasks_by_organization(
        organization_id: int,
        status: str = None
    ) -> list:
        """
        Get all tasks for an organization across all projects.
        
        Args:
            organization_id: ID of the organization
            status: Optional status filter
            
        Returns:
            QuerySet of tasks
        """
        queryset = Task.objects.filter(
            project__organization_id=organization_id
        ).select_related('project', 'project__organization')
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    @staticmethod
    def delete_task(task_id: int, organization_id: int = None) -> bool:
        """
        Delete a task.
        
        Args:
            task_id: ID of the task
            organization_id: Optional organization ID for validation
            
        Returns:
            True if deleted successfully
            
        Raises:
            OrganizationMismatchError: If task doesn't belong to organization
        """
        task = Task.objects.select_related('project__organization').get(id=task_id)
        
        if organization_id and task.project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Task {task_id} does not belong to organization {organization_id}"
            )
        
        task.delete()
        return True


class TaskCommentService:
    """Service class for task comment operations."""
    
    @staticmethod
    def add_comment(
        task_id: int,
        content: str,
        author_email: str,
        organization_id: int = None
    ) -> TaskComment:
        """
        Add a comment to a task.
        
        Args:
            task_id: ID of the task
            content: Comment content
            author_email: Email of the comment author
            organization_id: Optional organization ID for validation
            
        Returns:
            Created TaskComment instance
            
        Raises:
            OrganizationMismatchError: If task doesn't belong to organization
        """
        task = Task.objects.select_related('project__organization').get(id=task_id)
        
        # Validate organization ownership if provided
        if organization_id and task.project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Task {task_id} does not belong to organization {organization_id}"
            )
        
        comment = TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email
        )
        return comment
    
    @staticmethod
    def get_comments_by_task(task_id: int) -> list:
        """
        Get all comments for a task.
        
        Args:
            task_id: ID of the task
            
        Returns:
            QuerySet of comments
        """
        return TaskComment.objects.filter(task_id=task_id).select_related('task')
    
    @staticmethod
    def update_comment(comment_id: int, content: str) -> TaskComment:
        """
        Update a comment.
        
        Args:
            comment_id: ID of the comment
            content: New content
            
        Returns:
            Updated TaskComment instance
        """
        comment = TaskComment.objects.get(id=comment_id)
        comment.content = content
        comment.save()
        return comment
    
    @staticmethod
    def delete_comment(comment_id: int) -> bool:
        """
        Delete a comment.
        
        Args:
            comment_id: ID of the comment
            
        Returns:
            True if deleted successfully
        """
        comment = TaskComment.objects.get(id=comment_id)
        comment.delete()
        return True

