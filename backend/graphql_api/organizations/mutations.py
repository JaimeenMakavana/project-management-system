"""
GraphQL mutations for organizations.
"""
import graphene
from apps.organizations.services import OrganizationService
from .types import OrganizationType


class CreateOrganization(graphene.Mutation):
    """Create a new organization."""
    
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)
        slug = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, name, contact_email, slug=None):
        try:
            organization = OrganizationService.create_organization(
                name=name,
                contact_email=contact_email,
                slug=slug
            )
            return CreateOrganization(
                organization=organization,
                success=True,
                message="Organization created successfully"
            )
        except Exception as e:
            return CreateOrganization(
                organization=None,
                success=False,
                message=str(e)
            )


class UpdateOrganization(graphene.Mutation):
    """Update an existing organization."""
    
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        contact_email = graphene.String()
        slug = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, **kwargs):
        try:
            # Remove None values
            update_data = {k: v for k, v in kwargs.items() if v is not None}
            
            organization = OrganizationService.update_organization(id, **update_data)
            return UpdateOrganization(
                organization=organization,
                success=True,
                message="Organization updated successfully"
            )
        except Exception as e:
            return UpdateOrganization(
                organization=None,
                success=False,
                message=str(e)
            )


class OrganizationMutation(graphene.ObjectType):
    """Organization mutations."""
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()

