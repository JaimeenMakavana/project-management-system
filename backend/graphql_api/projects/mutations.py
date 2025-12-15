"""
GraphQL mutations for projects.
"""
import graphene
from datetime import datetime
from apps.projects.services import ProjectService
from apps.core.exceptions import OrganizationMismatchError
from .types import ProjectType


class CreateProject(graphene.Mutation):
    """Create a new project."""
    
    class Arguments:
        organization_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, organization_id, name, description="", status="ACTIVE", due_date=None):
        try:
            project = ProjectService.create_project(
                organization_id=organization_id,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(
                project=project,
                success=True,
                message="Project created successfully"
            )
        except Exception as e:
            return CreateProject(
                project=None,
                success=False,
                message=str(e)
            )


class UpdateProject(graphene.Mutation):
    """Update an existing project."""
    
    class Arguments:
        id = graphene.Int(required=True)
        organization_id = graphene.Int()
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, organization_id=None, **kwargs):
        try:
            # Remove None values
            update_data = {k: v for k, v in kwargs.items() if v is not None}
            
            project = ProjectService.update_project(
                project_id=id,
                organization_id=organization_id,
                **update_data
            )
            return UpdateProject(
                project=project,
                success=True,
                message="Project updated successfully"
            )
        except OrganizationMismatchError as e:
            return UpdateProject(
                project=None,
                success=False,
                message=str(e)
            )
        except Exception as e:
            return UpdateProject(
                project=None,
                success=False,
                message=str(e)
            )


class DeleteProject(graphene.Mutation):
    """Delete a project."""
    
    class Arguments:
        id = graphene.Int(required=True)
        organization_id = graphene.Int()
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, organization_id=None):
        try:
            ProjectService.delete_project(id, organization_id)
            return DeleteProject(
                success=True,
                message="Project deleted successfully"
            )
        except OrganizationMismatchError as e:
            return DeleteProject(
                success=False,
                message=str(e)
            )
        except Exception as e:
            return DeleteProject(
                success=False,
                message=str(e)
            )


class ProjectMutation(graphene.ObjectType):
    """Project mutations."""
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()

