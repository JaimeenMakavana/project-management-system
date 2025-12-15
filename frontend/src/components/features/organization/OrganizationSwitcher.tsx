"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export function OrganizationSwitcher() {
  const { organization, organizations, changeOrganization, loading } =
    useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !organization) {
    return (
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = (orgId: number) => {
    changeOrganization(orgId);
    setIsOpen(false);
  };

  return (
    <div
      className="relative px-6 py-5 border-b border-gray-200"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">
            {organization.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">
            {organization.name}
          </h2>
          <p className="text-xs text-gray-500 truncate">{organization.slug}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
          <div className="py-1">
            {organizations.map((org: Organization) => {
              const isSelected =
                parseInt(org.id, 10) === parseInt(organization.id, 10);

              return (
                <button
                  key={org.id}
                  onClick={() => handleSelect(parseInt(org.id, 10))}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-purple-50" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {org.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{org.slug}</p>
                  </div>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add new organization link */}
          <div className="border-t border-gray-100">
            <a
              href="/organizations"
              className="flex items-center space-x-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <span>Create new organization</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
