"""
Business logic for organization operations.
"""
from django.db import transaction
from django.utils.text import slugify
from .models import Organization


class OrganizationService:
    """Service class for organization-related business logic."""
    
    @staticmethod
    def create_organization(name: str, contact_email: str, slug: str = None) -> Organization:
        """
        Create a new organization.
        
        Args:
            name: Organization name
            contact_email: Contact email for the organization
            slug: Optional custom slug, auto-generated if not provided
            
        Returns:
            Created Organization instance
        """
        if not slug:
            slug = slugify(name)
        
        # Ensure slug is unique
        base_slug = slug
        counter = 1
        while Organization.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        organization = Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email
        )
        return organization
    
    @staticmethod
    def update_organization(organization_id: int, **kwargs) -> Organization:
        """
        Update an organization.
        
        Args:
            organization_id: ID of the organization
            **kwargs: Fields to update
            
        Returns:
            Updated Organization instance
        """
        organization = Organization.objects.get(id=organization_id)
        
        for field, value in kwargs.items():
            if hasattr(organization, field):
                setattr(organization, field, value)
        
        organization.save()
        return organization
    
    @staticmethod
    def get_organization_stats(organization_id: int) -> dict:
        """
        Get statistics for an organization.
        
        Args:
            organization_id: ID of the organization
            
        Returns:
            Dictionary with organization statistics
        """
        from apps.projects.models import Project
        from apps.tasks.models import Task
        
        organization = Organization.objects.get(id=organization_id)
        projects = Project.objects.filter(organization=organization)
        
        total_projects = projects.count()
        active_projects = projects.filter(status='ACTIVE').count()
        completed_projects = projects.filter(status='COMPLETED').count()
        
        # Get all tasks for this organization's projects
        total_tasks = Task.objects.filter(project__organization=organization).count()
        completed_tasks = Task.objects.filter(
            project__organization=organization,
            status='DONE'
        ).count()
        
        return {
            'total_projects': total_projects,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
        }

