"""
GraphQL mutations for tasks.
"""
import graphene
from datetime import datetime
from apps.tasks.services import TaskService, TaskCommentService
from apps.core.exceptions import OrganizationMismatchError, InvalidStatusTransitionError
from .types import TaskType, TaskCommentType


class CreateTask(graphene.Mutation):
    """Create a new task."""
    
    class Arguments:
        project_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
        organization_id = graphene.Int()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, project_id, title, description=None, status=None, 
               priority=None, assignee_email=None, due_date=None, organization_id=None):
        try:
            task = TaskService.create_task(
                project_id=project_id,
                title=title,
                description=description if description is not None else "",
                status=status if status is not None else "TODO",
                priority=priority if priority is not None else "MEDIUM",
                assignee_email=assignee_email if assignee_email is not None else "",
                due_date=due_date,
                organization_id=organization_id
            )
            return CreateTask(
                task=task,
                success=True,
                message="Task created successfully"
            )
        except OrganizationMismatchError as e:
            return CreateTask(
                task=None,
                success=False,
                message=str(e)
            )
        except Exception as e:
            return CreateTask(
                task=None,
                success=False,
                message=str(e)
            )


class UpdateTask(graphene.Mutation):
    """Update an existing task."""
    
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
        organization_id = graphene.Int()
        validate_transition = graphene.Boolean()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, organization_id=None, validate_transition=False, **kwargs):
        try:
            # Remove None values
            update_data = {k: v for k, v in kwargs.items() if v is not None}
            
            task = TaskService.update_task(
                task_id=id,
                organization_id=organization_id,
                validate_transition=validate_transition,
                **update_data
            )
            return UpdateTask(
                task=task,
                success=True,
                message="Task updated successfully"
            )
        except (OrganizationMismatchError, InvalidStatusTransitionError) as e:
            return UpdateTask(
                task=None,
                success=False,
                message=str(e)
            )
        except Exception as e:
            return UpdateTask(
                task=None,
                success=False,
                message=str(e)
            )


class DeleteTask(graphene.Mutation):
    """Delete a task."""
    
    class Arguments:
        id = graphene.Int(required=True)
        organization_id = graphene.Int()
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, organization_id=None):
        try:
            TaskService.delete_task(id, organization_id)
            return DeleteTask(
                success=True,
                message="Task deleted successfully"
            )
        except OrganizationMismatchError as e:
            return DeleteTask(
                success=False,
                message=str(e)
            )
        except Exception as e:
            return DeleteTask(
                success=False,
                message=str(e)
            )


class AddTaskComment(graphene.Mutation):
    """Add a comment to a task."""
    
    class Arguments:
        task_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
        organization_id = graphene.Int()
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, task_id, content, author_email, organization_id=None):
        try:
            comment = TaskCommentService.add_comment(
                task_id=task_id,
                content=content,
                author_email=author_email,
                organization_id=organization_id
            )
            return AddTaskComment(
                comment=comment,
                success=True,
                message="Comment added successfully"
            )
        except OrganizationMismatchError as e:
            return AddTaskComment(
                comment=None,
                success=False,
                message=str(e)
            )
        except Exception as e:
            return AddTaskComment(
                comment=None,
                success=False,
                message=str(e)
            )


class UpdateTaskComment(graphene.Mutation):
    """Update a task comment."""
    
    class Arguments:
        id = graphene.Int(required=True)
        content = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, content):
        try:
            comment = TaskCommentService.update_comment(id, content)
            return UpdateTaskComment(
                comment=comment,
                success=True,
                message="Comment updated successfully"
            )
        except Exception as e:
            return UpdateTaskComment(
                comment=None,
                success=False,
                message=str(e)
            )


class DeleteTaskComment(graphene.Mutation):
    """Delete a task comment."""
    
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        try:
            TaskCommentService.delete_comment(id)
            return DeleteTaskComment(
                success=True,
                message="Comment deleted successfully"
            )
        except Exception as e:
            return DeleteTaskComment(
                success=False,
                message=str(e)
            )


class TaskMutation(graphene.ObjectType):
    """Task mutations."""
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    add_task_comment = AddTaskComment.Field()
    update_task_comment = UpdateTaskComment.Field()
    delete_task_comment = DeleteTaskComment.Field()

