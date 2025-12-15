"""
Main GraphQL schema entry point.
"""
import graphene

from graphql_api.organizations.queries import OrganizationQuery
from graphql_api.organizations.mutations import OrganizationMutation
from graphql_api.projects.queries import ProjectQuery
from graphql_api.projects.mutations import ProjectMutation
from graphql_api.tasks.queries import TaskQuery
from graphql_api.tasks.mutations import TaskMutation


class Query(
    OrganizationQuery,
    ProjectQuery,
    TaskQuery,
    graphene.ObjectType
):
    """Root Query"""
    pass


class Mutation(
    OrganizationMutation,
    ProjectMutation,
    TaskMutation,
    graphene.ObjectType
):
    """Root Mutation"""
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)

