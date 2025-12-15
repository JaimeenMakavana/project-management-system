"""
Business logic for project operations.
"""
from datetime import date
from django.db.models import Count, Q
from apps.core.exceptions import OrganizationMismatchError
from .models import Project
from apps.organizations.models import Organization


class ProjectService:
    """Service class for project-related business logic."""
    
    @staticmethod
    def create_project(
        organization_id: int,
        name: str,
        description: str = "",
        status: str = "ACTIVE",
        due_date: date = None
    ) -> Project:
        """
        Create a new project for an organization.
        
        Args:
            organization_id: ID of the parent organization
            name: Project name
            description: Project description
            status: Project status (ACTIVE, COMPLETED, ON_HOLD)
            due_date: Optional due date
            
        Returns:
            Created Project instance
        """
        organization = Organization.objects.get(id=organization_id)
        
        project = Project.objects.create(
            organization=organization,
            name=name,
            description=description,
            status=status,
            due_date=due_date
        )
        return project
    
    @staticmethod
    def update_project(project_id: int, organization_id: int = None, **kwargs) -> Project:
        """
        Update a project.
        
        Args:
            project_id: ID of the project
            organization_id: Optional organization ID for validation
            **kwargs: Fields to update
            
        Returns:
            Updated Project instance
            
        Raises:
            OrganizationMismatchError: If project doesn't belong to organization
        """
        project = Project.objects.select_related('organization').get(id=project_id)
        
        # Validate organization ownership if provided
        if organization_id and project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Project {project_id} does not belong to organization {organization_id}"
            )
        
        for field, value in kwargs.items():
            if hasattr(project, field) and field != 'organization':
                setattr(project, field, value)
        
        project.save()
        return project
    
    @staticmethod
    def get_projects_by_organization(
        organization_id: int,
        status: str = None
    ) -> list:
        """
        Get all projects for an organization with optional filtering.
        
        Args:
            organization_id: ID of the organization
            status: Optional status filter
            
        Returns:
            QuerySet of projects
        """
        queryset = Project.objects.filter(
            organization_id=organization_id
        ).select_related('organization')
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    @staticmethod
    def get_project_stats(project_id: int) -> dict:
        """
        Get statistics for a specific project.
        
        Args:
            project_id: ID of the project
            
        Returns:
            Dictionary with project statistics
        """
        from apps.tasks.models import Task
        
        project = Project.objects.get(id=project_id)
        tasks = Task.objects.filter(project=project)
        
        total_tasks = tasks.count()
        todo_tasks = tasks.filter(status='TODO').count()
        in_progress_tasks = tasks.filter(status='IN_PROGRESS').count()
        done_tasks = tasks.filter(status='DONE').count()
        
        completion_rate = (done_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        return {
            'project_id': project_id,
            'total_tasks': total_tasks,
            'todo_tasks': todo_tasks,
            'in_progress_tasks': in_progress_tasks,
            'completed_tasks': done_tasks,
            'completion_rate': round(completion_rate, 2),
        }
    
    @staticmethod
    def delete_project(project_id: int, organization_id: int = None) -> bool:
        """
        Delete a project (and cascade delete all tasks).
        
        Args:
            project_id: ID of the project
            organization_id: Optional organization ID for validation
            
        Returns:
            True if deleted successfully
            
        Raises:
            OrganizationMismatchError: If project doesn't belong to organization
        """
        project = Project.objects.select_related('organization').get(id=project_id)
        
        if organization_id and project.organization_id != organization_id:
            raise OrganizationMismatchError(
                f"Project {project_id} does not belong to organization {organization_id}"
            )
        
        project.delete()
        return True

