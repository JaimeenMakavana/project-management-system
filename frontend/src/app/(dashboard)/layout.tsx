"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile top bar */}
        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 md:hidden">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-sm font-bold text-white">PM</span>
            </div>
            <span className="text-base font-semibold text-gray-900">
              Dashboard
            </span>
          </div>
          <SheetTrigger>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
          <Sidebar />
        </div>

        {/* Mobile drawer content using shadcn-style Sheet */}
        <SheetContent side="right" className="w-72 p-0">
          <Sidebar />
        </SheetContent>

        {/* Main content */}
        <main className="flex-1 w-full pt-14 md:pt-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </Sheet>
  );
}
