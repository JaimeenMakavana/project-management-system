"""
Pytest configuration for backend tests.
"""
import pytest
from django.conf import settings


@pytest.fixture(scope='session')
def django_db_setup():
    """Set up test database."""
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_project_management_db',
        'USER': settings.DATABASES['default']['USER'],
        'PASSWORD': settings.DATABASES['default']['PASSWORD'],
        'HOST': 'localhost',
        'PORT': '5432',
    }


@pytest.fixture
def organization_factory():
    """Factory for creating test organizations."""
    from apps.organizations.models import Organization
    
    def create_organization(name="Test Org", slug=None, contact_email="test@example.com"):
        if not slug:
            slug = name.lower().replace(" ", "-")
        return Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email
        )
    
    return create_organization


@pytest.fixture
def project_factory():
    """Factory for creating test projects."""
    from apps.projects.models import Project
    
    def create_project(organization, name="Test Project", status="ACTIVE"):
        return Project.objects.create(
            organization=organization,
            name=name,
            status=status
        )
    
    return create_project


@pytest.fixture
def task_factory():
    """Factory for creating test tasks."""
    from apps.tasks.models import Task
    
    def create_task(project, title="Test Task", status="TODO"):
        return Task.objects.create(
            project=project,
            title=title,
            status=status
        )
    
    return create_task

