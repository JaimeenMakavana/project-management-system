"use client";

import { useQuery } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { GET_PROJECTS } from "@/graphql/queries";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { Loading, LoadingCard } from "@/components/ui/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useOrganization } from "@/hooks/useOrganization";
import { FolderKanban, Plus } from "lucide-react";

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
        title="Dashboard"
        actions={
          <Link href="/projects/new">
            <Button className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" strokeWidth={1} />
              <span>Create Project</span>
            </Button>
          </Link>
        }
      />

      <div className="p-4 ">
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
            {/* Project summary / memory */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                  <FolderKanban className="w-5 h-5" strokeWidth={1} />
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">
                    {data.projects.length} project
                    {data.projects.length === 1 ? "" : "s"} in this organization
                  </p>
                  <p className="text-xs text-gray-500">
                    Quickly glance at your current project portfolio.
                  </p>
                </div>
              </div>
            </div>

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
