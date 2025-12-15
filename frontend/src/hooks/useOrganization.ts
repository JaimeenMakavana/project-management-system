'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORGANIZATIONS } from '@/graphql/queries';
import { CREATE_ORGANIZATION } from '@/graphql/mutations';

interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
}

/**
 * Custom hook for managing organization context
 * Auto-creates a default organization if none exists (personal use)
 */
export function useOrganization() {
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, loading: queryLoading, refetch } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: 'network-only',
  });

  const [createOrganization, { loading: createLoading }] = useMutation(CREATE_ORGANIZATION, {
    onCompleted: (result) => {
      if (result.createOrganization.success) {
        const newOrg = result.createOrganization.organization;
        const newOrgId = parseInt(newOrg.id, 10);
        setOrganizationId(newOrgId);
        setCurrentOrg(newOrg);
        localStorage.setItem('organizationId', newOrgId.toString());
        setIsInitialized(true);
      }
    },
  });

  useEffect(() => {
    if (queryLoading || isInitialized) return;

    const organizations = data?.organizations || [];

    if (organizations.length > 0) {
      // Use stored org ID or fall back to first organization
      const storedOrgId = localStorage.getItem('organizationId');
      const storedId = storedOrgId ? parseInt(storedOrgId, 10) : null;
      
      // Find the stored organization or use the first one
      const selectedOrg = storedId 
        ? organizations.find((org: Organization) => parseInt(org.id, 10) === storedId) || organizations[0]
        : organizations[0];
      
      const selectedId = parseInt(selectedOrg.id, 10);
      setOrganizationId(selectedId);
      setCurrentOrg(selectedOrg);
      localStorage.setItem('organizationId', selectedId.toString());
      setIsInitialized(true);
    } else if (!queryLoading && organizations.length === 0) {
      // No organizations exist - create a default one for personal use
      createOrganization({
        variables: {
          name: 'My Workspace',
          contactEmail: 'user@personal.local',
          slug: 'my-workspace',
        },
      });
    }
  }, [data, queryLoading, isInitialized, createOrganization]);

  const changeOrganization = useCallback((newOrgId: number) => {
    const organizations = data?.organizations || [];
    const newOrg = organizations.find((org: Organization) => parseInt(org.id, 10) === newOrgId);
    
    if (newOrg) {
      setOrganizationId(newOrgId);
      setCurrentOrg(newOrg);
      localStorage.setItem('organizationId', newOrgId.toString());
    }
  }, [data]);

  const loading = queryLoading || createLoading || !isInitialized;

  return {
    organizationId,
    organization: currentOrg,
    organizations: data?.organizations || [],
    loading,
    changeOrganization,
    refetch,
  };
}
