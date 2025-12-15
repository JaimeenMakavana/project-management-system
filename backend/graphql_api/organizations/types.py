"""
GraphQL types for organizations.
"""
import graphene
from graphene_django import DjangoObjectType
from apps.organizations.models import Organization


class OrganizationType(DjangoObjectType):
    """GraphQL type for Organization model."""
    
    project_count = graphene.Int()
    active_project_count = graphene.Int()
    
    class Meta:
        model = Organization
        fields = ('id', 'name', 'slug', 'contact_email', 'created_at', 'updated_at')
    
    def resolve_project_count(self, info):
        """Get total number of projects for this organization."""
        return self.projects.count()
    
    def resolve_active_project_count(self, info):
        """Get number of active projects."""
        return self.projects.filter(status='ACTIVE').count()


class OrganizationStatsType(graphene.ObjectType):
    """Statistics for an organization."""
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()

