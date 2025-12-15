"use client";

import { useState, useEffect } from "react";

const WALKTHROUGH_STORAGE_KEY = "pms-walkthrough-seen";

export function useWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(true); // Default to true to avoid flash

  useEffect(() => {
    // Check if user has seen the walkthrough
    const seen = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);

    if (!seen) {
      // First time user - show walkthrough after a brief delay for better UX
      setTimeout(() => {
        setIsOpen(true);
        setHasSeenWalkthrough(false);
      }, 800);
    } else {
      setHasSeenWalkthrough(true);
    }
  }, []);

  const closeWalkthrough = () => {
    setIsOpen(false);
    // Mark as seen
    localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    setHasSeenWalkthrough(true);
  };

  const openWalkthrough = () => {
    setIsOpen(true);
  };

  const resetWalkthrough = () => {
    localStorage.removeItem(WALKTHROUGH_STORAGE_KEY);
    setHasSeenWalkthrough(false);
    setIsOpen(true);
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeWalkthrough();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return {
    isOpen,
    hasSeenWalkthrough,
    openWalkthrough,
    closeWalkthrough,
    resetWalkthrough,
  };
}
