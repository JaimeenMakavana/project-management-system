"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WalkthroughVideo } from "@/components/features/walkthrough/WalkthroughVideo";
import { useWalkthrough } from "@/hooks/useWalkthrough";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openWalkthrough, closeWalkthrough } = useWalkthrough();

  return (
    <>
      <Sheet>
        <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden">
          {/* Mobile top bar */}
          <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 py-3 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-card-dark)] flex items-center justify-center">
                <LayoutDashboard
                  className="w-5 h-5 text-[var(--text-primary)]"
                  strokeWidth={1}
                />
              </div>
              <span className="text-base font-semibold text-[var(--text-primary)]">
                Dashboard
              </span>
            </div>
            <SheetTrigger>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-sm hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-offset-2"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </SheetTrigger>
          </header>

          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar onOpenWalkthrough={openWalkthrough} />
          </div>

          {/* Mobile drawer content using shadcn-style Sheet */}
          <SheetContent side="right" className="w-72 p-0">
            <Sidebar onOpenWalkthrough={openWalkthrough} />
          </SheetContent>

          {/* Main content */}
          <main className="flex-1 w-full pt-14 md:pt-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </Sheet>

      {/* Walkthrough Video Modal */}
      <WalkthroughVideo isOpen={isOpen} onClose={closeWalkthrough} />
    </>
  );
}
