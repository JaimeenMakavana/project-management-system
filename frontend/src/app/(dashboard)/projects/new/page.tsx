"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardBody } from "@/components/ui/Card";
import { ProjectForm } from "@/components/features/projects/ProjectForm";
import { Loading } from "@/components/ui/Loading";
import { useOrganization } from "@/hooks/useOrganization";

export default function NewProjectPage() {
  const router = useRouter();
  const { organizationId, loading } = useOrganization();

  if (loading || !organizationId) {
    return (
      <div>
        <Header title="Create New Project" />
        <div className="p-8 flex justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Create New Project" />

      <div className="p-8 max-w-2xl mx-auto">
        <Card>
          <CardBody>
            <ProjectForm
              organizationId={organizationId}
              onSuccess={() => router.push("/projects")}
              onCancel={() => router.back()}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
