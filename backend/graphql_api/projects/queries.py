"""
GraphQL queries for projects.
"""
import graphene
from apps.projects.models import Project
from apps.projects.services import ProjectService
from .types import ProjectType, ProjectStatsType


class ProjectQuery(graphene.ObjectType):
    """Project queries."""
    
    # List all projects (optionally filtered by organization)
    projects = graphene.List(
        ProjectType,
        organization_id=graphene.Int(),
        status=graphene.String(),
        description="Get all projects, optionally filtered by organization and status"
    )
    
    # Get single project by ID
    project = graphene.Field(
        ProjectType,
        id=graphene.Int(required=True),
        description="Get a specific project by ID"
    )
    
    # Get projects for a specific organization
    projects_by_organization = graphene.List(
        ProjectType,
        organization_id=graphene.Int(required=True),
        status=graphene.String(),
        description="Get all projects for an organization"
    )
    
    # Get project statistics
    project_stats = graphene.Field(
        ProjectStatsType,
        project_id=graphene.Int(required=True),
        description="Get statistics for a project"
    )
    
    def resolve_projects(self, info, organization_id=None, status=None):
        """Resolve all projects with optional filters."""
        queryset = Project.objects.select_related('organization').all()
        
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    def resolve_project(self, info, id):
        """Resolve single project by ID."""
        try:
            return Project.objects.select_related('organization').get(id=id)
        except Project.DoesNotExist:
            return None
    
    def resolve_projects_by_organization(self, info, organization_id, status=None):
        """Resolve projects for a specific organization."""
        return ProjectService.get_projects_by_organization(organization_id, status)
    
    def resolve_project_stats(self, info, project_id):
        """Resolve project statistics."""
        try:
            stats = ProjectService.get_project_stats(project_id)
            return ProjectStatsType(**stats)
        except Project.DoesNotExist:
            return None

