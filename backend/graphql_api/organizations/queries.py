"""
GraphQL queries for organizations.
"""
import graphene
from apps.organizations.models import Organization
from apps.organizations.services import OrganizationService
from .types import OrganizationType, OrganizationStatsType


class OrganizationQuery(graphene.ObjectType):
    """Organization queries."""
    
    # List all organizations
    organizations = graphene.List(
        OrganizationType,
        description="Get all organizations"
    )
    
    # Get single organization by ID
    organization = graphene.Field(
        OrganizationType,
        id=graphene.Int(required=True),
        description="Get a specific organization by ID"
    )
    
    # Get organization by slug
    organization_by_slug = graphene.Field(
        OrganizationType,
        slug=graphene.String(required=True),
        description="Get an organization by slug"
    )
    
    # Get organization statistics
    organization_stats = graphene.Field(
        OrganizationStatsType,
        organization_id=graphene.Int(required=True),
        description="Get statistics for an organization"
    )
    
    def resolve_organizations(self, info):
        """Resolve all organizations."""
        return Organization.objects.all()
    
    def resolve_organization(self, info, id):
        """Resolve single organization by ID."""
        try:
            return Organization.objects.get(id=id)
        except Organization.DoesNotExist:
            return None
    
    def resolve_organization_by_slug(self, info, slug):
        """Resolve organization by slug."""
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            return None
    
    def resolve_organization_stats(self, info, organization_id):
        """Resolve organization statistics."""
        try:
            stats = OrganizationService.get_organization_stats(organization_id)
            return OrganizationStatsType(**stats)
        except Organization.DoesNotExist:
            return None

