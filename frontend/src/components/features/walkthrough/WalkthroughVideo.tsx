"use client";

import React, { useEffect, useState } from "react";
import { X, PlayCircle } from "lucide-react";

interface WalkthroughVideoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkthroughVideo({ isOpen, onClose }: WalkthroughVideoProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-title"
    >
      <div className="relative w-full max-w-4xl mx-4 md:mx-8 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PlayCircle className="w-6 h-6 text-[var(--accent-purple)]" />
            <h2
              id="walkthrough-title"
              className="text-xl font-semibold text-white"
            >
              Welcome! Watch this quick walkthrough
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/80"
            aria-label="Close walkthrough video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-[var(--bg-card)] rounded-lg shadow-2xl overflow-hidden">
          {/* Aspect ratio container for responsive video */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-main)]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[var(--accent-purple)]/30 border-t-[var(--accent-purple)] rounded-full animate-spin"></div>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Loading video...
                  </p>
                </div>
              </div>
            )}
            <iframe
              src="https://www.loom.com/embed/53e0c608d8fa4a24b8e112765f304ac6?sid=e8b3e8d2-4f35-4e1e-9a1c-6f5a7d8e9f0a&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              onLoad={() => setIsLoading(false)}
              title="Project Management System Walkthrough"
            />
          </div>

          {/* Footer with helpful text */}
          <div className="p-4 bg-[var(--bg-card-dark)] border-t border-[var(--border-subtle)]">
            <p className="text-sm text-[var(--text-secondary)] text-center">
              You can reopen this video anytime from the{" "}
              <span className="text-[var(--accent-purple)] font-medium">
                Help & Walkthrough
              </span>{" "}
              option in the sidebar
            </p>
          </div>
        </div>

        {/* Close button hint */}
        <div className="mt-4 text-center">
          <p className="text-sm text-white/60">
            Press{" "}
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd> or
            click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}
