"""
Tests for projects app.
"""
import pytest
from datetime import date
from django.test import TestCase
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.projects.services import ProjectService
from apps.core.exceptions import OrganizationMismatchError


@pytest.mark.django_db
class TestProjectModel:
    """Test Project model."""
    
    def test_create_project(self):
        """Test creating a project."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(
            organization=org,
            name="Test Project",
            description="Test description",
            status="ACTIVE"
        )
        assert project.name == "Test Project"
        assert project.organization == org
        assert project.status == "ACTIVE"
    
    def test_project_default_status(self):
        """Test project default status is ACTIVE."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = Project.objects.create(
            organization=org,
            name="Test Project"
        )
        assert project.status == "ACTIVE"


@pytest.mark.django_db
class TestProjectService:
    """Test Project service layer."""
    
    def test_create_project(self):
        """Test creating a project via service."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = ProjectService.create_project(
            organization_id=org.id,
            name="Test Project",
            description="Test description"
        )
        assert project.name == "Test Project"
        assert project.organization_id == org.id
    
    def test_update_project(self):
        """Test updating a project."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = ProjectService.create_project(
            organization_id=org.id,
            name="Test Project"
        )
        
        updated_project = ProjectService.update_project(
            project_id=project.id,
            name="Updated Project",
            status="COMPLETED"
        )
        assert updated_project.name == "Updated Project"
        assert updated_project.status == "COMPLETED"
    
    def test_update_project_wrong_organization(self):
        """Test updating project with wrong organization raises error."""
        org1 = Organization.objects.create(
            name="Org 1",
            slug="org-1",
            contact_email="org1@example.com"
        )
        org2 = Organization.objects.create(
            name="Org 2",
            slug="org-2",
            contact_email="org2@example.com"
        )
        project = ProjectService.create_project(
            organization_id=org1.id,
            name="Test Project"
        )
        
        with pytest.raises(OrganizationMismatchError):
            ProjectService.update_project(
                project_id=project.id,
                organization_id=org2.id,
                name="Updated"
            )
    
    def test_get_projects_by_organization(self):
        """Test getting projects by organization."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        ProjectService.create_project(org.id, "Project 1")
        ProjectService.create_project(org.id, "Project 2")
        
        projects = ProjectService.get_projects_by_organization(org.id)
        assert len(projects) == 2
    
    def test_get_project_stats(self):
        """Test getting project statistics."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        project = ProjectService.create_project(org.id, "Test Project")
        
        stats = ProjectService.get_project_stats(project.id)
        assert 'project_id' in stats
        assert 'total_tasks' in stats
        assert 'completion_rate' in stats

