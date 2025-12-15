"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORGANIZATIONS } from "@/graphql/queries";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { OrganizationForm } from "@/components/features/organization/OrganizationForm";
import { Header } from "@/components/layout/Header";
import {
  Building2,
  Mail,
  FolderKanban,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  projectCount: number;
  activeProjectCount: number;
  createdAt: string;
}

export default function OrganizationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { organizationId, changeOrganization } = useOrganization();

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: "network-only",
  });

  const organizations: Organization[] = data?.organizations || [];

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleSelectOrganization = (orgId: number) => {
    changeOrganization(orgId);
  };

  if (loading) {
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700">
            Error loading organizations: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <Header
        title="Organizations"
        subtitle="Manage your workspaces and organizations"
        actions={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={1} />
            <span>New Organization</span>
          </Button>
        }
      />

      <div className="p-4">
        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-[var(--badge-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2
                className="w-8 h-8 text-[var(--text-secondary)]"
                strokeWidth={1}
              />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No organizations yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Create your first organization to get started.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" strokeWidth={1} />
              <span>Create Organization</span>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => {
              const isSelected = parseInt(org.id, 10) === organizationId;

              return (
                <Card
                  key={org.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-[var(--accent-purple)] bg-[var(--accent-purple)]/10"
                      : "hover:border-[var(--border-subtle)]"
                  }`}
                  onClick={() => handleSelectOrganization(parseInt(org.id, 10))}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)] flex items-center justify-center">
                      <span className="text-[var(--text-inverse)] font-semibold text-base">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    {org.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    @{org.slug}
                  </p>

                  <div className="flex items-center text-sm text-[var(--text-secondary)] mb-3">
                    <Mail
                      className="w-4 h-4 mr-2 text-[var(--text-secondary)]"
                      strokeWidth={1}
                    />
                    {org.contactEmail}
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                      <FolderKanban
                        className="w-4 h-4 mr-1.5 text-[var(--text-secondary)]"
                        strokeWidth={1}
                      />
                      {org.projectCount} projects
                    </div>
                    <div className="flex items-center text-sm text-[var(--accent-lime)]">
                      <CheckCircle2
                        className="w-4 h-4 mr-1.5 text-[var(--accent-lime)]"
                        strokeWidth={1}
                      />
                      {org.activeProjectCount} active
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      {/* Create Organization Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Organization"
      >
        <OrganizationForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
