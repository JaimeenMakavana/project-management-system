"""
Organization domain models.
"""
from django.db import models
from apps.core.models import TimeStampedModel


class Organization(TimeStampedModel):
    """Organization model for multi-tenancy."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    contact_email = models.EmailField()

    class Meta:
        db_table = 'organizations'
        ordering = ['name']

    def __str__(self):
        return self.name

