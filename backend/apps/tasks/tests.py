"""
Tests for tasks app.
"""
import pytest
from django.test import TestCase
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment
from apps.tasks.services import TaskService, TaskCommentService
from apps.core.exceptions import OrganizationMismatchError, InvalidStatusTransitionError


@pytest.mark.django_db
class TestTaskModel:
    """Test Task model."""
    
    def test_create_task(self):
        """Test creating a task."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(
            organization=org,
            name="Test Project"
        )
        task = Task.objects.create(
            project=project,
            title="Test Task",
            description="Test description"
        )
        assert task.title == "Test Task"
        assert task.status == "TODO"
    
    def test_task_default_status(self):
        """Test task default status is TODO."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        task = Task.objects.create(project=project, title="Test Task")
        assert task.status == "TODO"


@pytest.mark.django_db
class TestTaskService:
    """Test Task service layer."""
    
    def test_create_task(self):
        """Test creating a task via service."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        
        task = TaskService.create_task(
            project_id=project.id,
            title="Test Task",
            description="Test description",
            assignee_email="test@example.com"
        )
        assert task.title == "Test Task"
        assert task.assignee_email == "test@example.com"
    
    def test_update_task(self):
        """Test updating a task."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        task = TaskService.create_task(project.id, "Test Task")
        
        updated_task = TaskService.update_task(
            task_id=task.id,
            status="IN_PROGRESS"
        )
        assert updated_task.status == "IN_PROGRESS"
    
    def test_status_transition_validation(self):
        """Test status transition validation."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        task = TaskService.create_task(project.id, "Test Task", status="DONE")
        
        # Valid transition should work
        updated_task = TaskService.update_task(
            task_id=task.id,
            status="TODO",
            validate_transition=True
        )
        assert updated_task.status == "TODO"
    
    def test_get_tasks_by_project(self):
        """Test getting tasks by project."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        TaskService.create_task(project.id, "Task 1")
        TaskService.create_task(project.id, "Task 2")
        
        tasks = TaskService.get_tasks_by_project(project.id)
        assert len(tasks) == 2


@pytest.mark.django_db
class TestTaskCommentService:
    """Test TaskComment service layer."""
    
    def test_add_comment(self):
        """Test adding a comment to a task."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        task = TaskService.create_task(project.id, "Test Task")
        
        comment = TaskCommentService.add_comment(
            task_id=task.id,
            content="Test comment",
            author_email="test@example.com"
        )
        assert comment.content == "Test comment"
        assert comment.author_email == "test@example.com"
    
    def test_get_comments_by_task(self):
        """Test getting comments for a task."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(organization=org, name="Test Project")
        task = TaskService.create_task(project.id, "Test Task")
        
        TaskCommentService.add_comment(task.id, "Comment 1", "user1@example.com")
        TaskCommentService.add_comment(task.id, "Comment 2", "user2@example.com")
        
        comments = TaskCommentService.get_comments_by_task(task.id)
        assert len(comments) == 2

