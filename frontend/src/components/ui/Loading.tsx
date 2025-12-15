import React from "react";

export function Loading({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-[var(--border-subtle)] border-t-[var(--bg-card-dark)] rounded-full animate-spin`}
      ></div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] p-6 animate-pulse">
      <div className="h-4 bg-[var(--badge-bg)] rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-[var(--badge-bg)] rounded w-full mb-2"></div>
      <div className="h-3 bg-[var(--badge-bg)] rounded w-5/6"></div>
    </div>
  );
}
