import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <TooltipProvider>
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 py-3 sticky top-0 z-10 h-[65px] flex items-center w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-[var(--text-primary)] break-words">
              {title}{" "}
              {subtitle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-main)]"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)]">
                        i
                      </span>
                      <span className="hidden sm:inline">View description</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs md:max-w-md">
                    {subtitle}
                  </TooltipContent>
                </Tooltip>
              )}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
