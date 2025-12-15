"""
GraphQL types for projects.
"""
import graphene
from graphene_django import DjangoObjectType
from apps.projects.models import Project


class ProjectType(DjangoObjectType):
    """GraphQL type for Project model."""
    
    task_count = graphene.Int()
    completed_tasks = graphene.Int()
    in_progress_tasks = graphene.Int()
    todo_tasks = graphene.Int()
    completion_rate = graphene.Float()
    tasks = graphene.List('graphql_api.tasks.types.TaskType')
    
    class Meta:
        model = Project
        fields = ('id', 'organization', 'name', 'description', 'status', 'due_date', 'created_at', 'updated_at', 'tasks')
    
    def resolve_task_count(self, info):
        """Get total number of tasks."""
        return self.tasks.count()
    
    def resolve_completed_tasks(self, info):
        """Get number of completed tasks."""
        return self.tasks.filter(status='DONE').count()
    
    def resolve_in_progress_tasks(self, info):
        """Get number of in-progress tasks."""
        return self.tasks.filter(status='IN_PROGRESS').count()
    
    def resolve_todo_tasks(self, info):
        """Get number of todo tasks."""
        return self.tasks.filter(status='TODO').count()
    
    def resolve_completion_rate(self, info):
        """Calculate task completion rate."""
        total = self.tasks.count()
        if total == 0:
            return 0.0
        completed = self.tasks.filter(status='DONE').count()
        return round((completed / total) * 100, 2)
    
    def resolve_tasks(self, info):
        """Get all tasks for this project."""
        return self.tasks.all()


class ProjectStatsType(graphene.ObjectType):
    """Statistics for a project."""
    project_id = graphene.Int()
    total_tasks = graphene.Int()
    todo_tasks = graphene.Int()
    in_progress_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()

