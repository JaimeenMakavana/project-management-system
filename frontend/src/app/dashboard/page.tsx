"use client";

import { useQuery } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { GET_PROJECTS } from "@/graphql/queries";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { Loading, LoadingCard } from "@/components/ui/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useOrganization } from "@/hooks/useOrganization";

export default function DashboardPage() {
  const { organizationId, loading: orgLoading } = useOrganization();

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: { organizationId },
    skip: !organizationId,
  });

  if (orgLoading || !organizationId) {
    return (
      <div>
        <Header title="Project Dashboard" />
        <div className="p-8 flex justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Project Dashboard"
        actions={
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        }
      />

      <div className="p-8">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Error loading projects: {error.message}
          </div>
        )}

        {data && data.projects && (
          <>
            {data.projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No projects yet</p>
                <Link href="/projects/new">
                  <Button>Create Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


