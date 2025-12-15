"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ORGANIZATION } from "@/graphql/mutations";
import { GET_ORGANIZATIONS } from "@/graphql/queries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface OrganizationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrganizationForm({
  onSuccess,
  onCancel,
}: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    slug: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createOrganization, { loading }] = useMutation(CREATE_ORGANIZATION, {
    refetchQueries: [{ query: GET_ORGANIZATIONS }],
    onCompleted: (data) => {
      if (data.createOrganization.success) {
        onSuccess?.();
      } else {
        setErrors({ submit: data.createOrganization.message });
      }
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await createOrganization({
      variables: {
        name: formData.name.trim(),
        contactEmail: formData.contactEmail.trim(),
        slug: formData.slug || undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="e.g., Acme Corporation"
          value={formData.name}
          onChange={handleNameChange}
          error={errors.name}
          required
        />

        <Input
          label="Contact Email"
          type="email"
          placeholder="e.g., contact@acme.com"
          value={formData.contactEmail}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
          }
          error={errors.contactEmail}
          required
        />

        <Input
          label="Slug (URL-friendly name)"
          placeholder="e.g., acme-corporation"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          helperText="Auto-generated from name. Used in URLs."
        />
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          Create Organization
        </Button>
      </div>
    </form>
  );
}
