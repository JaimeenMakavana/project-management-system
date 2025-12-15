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
        <Loading text="Loading organizations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700">
            Error loading organizations: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-1">
            Manage your workspaces and organizations
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      {organizations.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No organizations yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first organization to get started.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Organization
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
                    ? "ring-2 ring-purple-500 bg-purple-50/50"
                    : "hover:border-gray-300"
                }`}
                onClick={() => handleSelectOrganization(parseInt(org.id, 10))}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {org.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{org.slug}</p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {org.contactEmail}
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-1.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    {org.projectCount} projects
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <svg
                      className="w-4 h-4 mr-1.5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {org.activeProjectCount} active
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
