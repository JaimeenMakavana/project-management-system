"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { GET_PROJECTS } from "@/graphql/queries";
import { ProjectCard } from "@/components/features/projects/ProjectCard";
import { Loading, LoadingCard } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { useOrganization } from "@/hooks/useOrganization";

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { organizationId, loading: orgLoading } = useOrganization();

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      organizationId,
      status: statusFilter || null,
    },
    skip: !organizationId,
  });
  console.log("data::: ", data);

  if (orgLoading || !organizationId) {
    return (
      <div>
        <Header title="Projects" subtitle="Manage all your projects" />
        <div className="p-8 flex justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Projects"
        subtitle="Manage all your projects"
        actions={
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        }
      />

      <div className="p-8">
        {/* Filters */}
        <div className="mb-6">
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Projects" },
              { value: "ACTIVE", label: "Active" },
              { value: "COMPLETED", label: "Completed" },
              { value: "ON_HOLD", label: "On Hold" },
            ]}
          />
        </div>

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
                <p className="text-gray-600 mb-4">No projects found</p>
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
