"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  ListChecks,
  FolderKanban,
  Building2,
} from "lucide-react";
import { OrganizationSwitcher } from "@/components/features/organization/OrganizationSwitcher";
import { SheetClose } from "@/components/ui/sheet";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1} />,
    },
    {
      name: "My Tasks",
      href: "/tasks",
      icon: <ListChecks className="w-5 h-5" strokeWidth={1} />,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderKanban className="w-5 h-5" strokeWidth={1} />,
    },
    {
      name: "Organizations",
      href: "/organizations",
      icon: <Building2 className="w-5 h-5" strokeWidth={1} />,
      requiresAuth: true,
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="w-full md:w-64 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] min-h-full md:min-h-screen flex flex-col">
      {/* Organization Switcher */}
      <OrganizationSwitcher />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          return (
            <SheetClose asChild key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </div>
  );
}
