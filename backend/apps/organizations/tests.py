"""
Tests for organizations app.
"""
import pytest
from django.test import TestCase
from apps.organizations.models import Organization
from apps.organizations.services import OrganizationService


@pytest.mark.django_db
class TestOrganizationModel:
    """Test Organization model."""
    
    def test_create_organization(self):
        """Test creating an organization."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        assert org.name == "Test Org"
        assert org.slug == "test-org"
        assert org.contact_email == "test@example.com"
    
    def test_organization_str(self):
        """Test organization string representation."""
        org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )
        assert str(org) == "Test Org"


@pytest.mark.django_db
class TestOrganizationService:
    """Test Organization service layer."""
    
    def test_create_organization_with_auto_slug(self):
        """Test creating organization with auto-generated slug."""
        org = OrganizationService.create_organization(
            name="Test Organization",
            contact_email="test@example.com"
        )
        assert org.slug == "test-organization"
    
    def test_create_organization_with_custom_slug(self):
        """Test creating organization with custom slug."""
        org = OrganizationService.create_organization(
            name="Test Organization",
            contact_email="test@example.com",
            slug="custom-slug"
        )
        assert org.slug == "custom-slug"
    
    def test_create_organization_duplicate_slug(self):
        """Test creating organization with duplicate slug generates unique slug."""
        OrganizationService.create_organization(
            name="Test Org",
            contact_email="test1@example.com",
            slug="test-slug"
        )
        org2 = OrganizationService.create_organization(
            name="Test Org 2",
            contact_email="test2@example.com",
            slug="test-slug"
        )
        assert org2.slug == "test-slug-1"
    
    def test_get_organization_stats(self):
        """Test getting organization statistics."""
        org = OrganizationService.create_organization(
            name="Test Org",
            contact_email="test@example.com"
        )
        stats = OrganizationService.get_organization_stats(org.id)
        
        assert 'total_projects' in stats
        assert 'active_projects' in stats
        assert 'completed_projects' in stats
        assert 'total_tasks' in stats
        assert 'completed_tasks' in stats

