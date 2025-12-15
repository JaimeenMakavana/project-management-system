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
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 py-3 sticky top-0 z-10 flex items-center w-full">
        <div className="flex gap-3 md:gap-4 items-center justify-between w-full min-w-0">
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1 className="text-base md:text-lg lg:text-xl font-bold text-[var(--text-primary)] flex flex-wrap items-center gap-2">
              <span className="truncate">{title}</span>
              {subtitle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-main)] flex-shrink-0"
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
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {actions && <div className="hidden sm:block">{actions}</div>}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
