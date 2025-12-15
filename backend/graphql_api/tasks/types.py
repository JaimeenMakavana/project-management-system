"""
GraphQL types for tasks.
"""
import graphene
from graphene_django import DjangoObjectType
from apps.tasks.models import Task, TaskComment


class TaskType(DjangoObjectType):
    """GraphQL type for Task model."""
    
    comment_count = graphene.Int()
    comments = graphene.List('graphql_api.tasks.types.TaskCommentType')
    
    class Meta:
        model = Task
        fields = ('id', 'project', 'title', 'description', 'status', 'priority', 'assignee_email', 'due_date', 'created_at', 'updated_at')
    
    def resolve_comment_count(self, info):
        """Get number of comments for this task."""
        return self.comments.count()
    
    def resolve_comments(self, info):
        """Get all comments for this task."""
        return self.comments.all()


class TaskCommentType(DjangoObjectType):
    """GraphQL type for TaskComment model."""
    
    class Meta:
        model = TaskComment
        fields = ('id', 'task', 'content', 'author_email', 'created_at', 'updated_at')

