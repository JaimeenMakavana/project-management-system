import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--bg-card-dark)] rounded-lg flex items-center justify-center">
              <LayoutDashboard
                className="w-6 h-6 text-[var(--text-primary)]"
                strokeWidth={1}
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Project Manager
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">
            Manage Projects with Ease
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            A modern, multi-tenant project management system. Organize your
            projects, track tasks, and collaborate with your team.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/projects" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Projects
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-[var(--bg-card)] rounded-lg p-6 shadow-sm border border-[var(--border-subtle)]">
              <div className="w-12 h-12 bg-[var(--badge-bg)] rounded-lg flex items-center justify-center mx-auto mb-4">
                <FolderKanban
                  className="w-6 h-6 text-[var(--text-primary)]"
                  strokeWidth={1}
                />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Project Management
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Create and organize projects with status tracking and due dates
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-lg p-6 shadow-sm border border-[var(--border-subtle)]">
              <div className="w-12 h-12 bg-[var(--badge-bg)] rounded-lg flex items-center justify-center mx-auto mb-4">
                <ClipboardList
                  className="w-6 h-6 text-[var(--text-primary)]"
                  strokeWidth={1}
                />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Task Tracking
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Manage tasks with Kanban boards and real-time status updates
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-lg p-6 shadow-sm border border-[var(--border-subtle)]">
              <div className="w-12 h-12 bg-[var(--badge-bg)] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users
                  className="w-6 h-6 text-[var(--text-primary)]"
                  strokeWidth={1}
                />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Team Collaboration
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Comment on tasks and collaborate with your team in real-time
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border-subtle)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--text-secondary)] text-sm">
          © 2025 Project Management System. Built with passion.
        </div>
      </footer>
    </div>
  );
}
