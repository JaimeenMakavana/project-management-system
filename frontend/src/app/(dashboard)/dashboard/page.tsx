"use client";

import { useQuery } from "@apollo/client";
import { Header } from "@/components/layout/Header";
import { Loading } from "@/components/ui/Loading";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useOrganization } from "@/hooks/useOrganization";
import { Plus } from "lucide-react";
import { GET_ORGANIZATION_STATS } from "@/graphql/queries";
import type {
  GetOrganizationStatsResponse,
  GetOrganizationStatsVariables,
} from "@/graphql/types";
import { OrganizationStats } from "@/components/features/organization/OrganizationStats";

export default function DashboardPage() {
  const { organizationId, loading: orgLoading } = useOrganization();

  const { data, loading, error } = useQuery<
    GetOrganizationStatsResponse,
    GetOrganizationStatsVariables
  >(GET_ORGANIZATION_STATS, {
    variables: { organizationId: organizationId as number },
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
          <div className="py-8 flex justify-center">
            <Loading size="lg" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Error loading organization stats: {error.message}
          </div>
        )}

        {data && data.organizationStats && (
          <OrganizationStats stats={data.organizationStats} />
        )}
      </div>
    </div>
  );
}
