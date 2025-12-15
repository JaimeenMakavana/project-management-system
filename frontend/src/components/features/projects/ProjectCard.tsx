import React from "react";
import Link from "next/link";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Project } from "@/graphql/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card hover className="h-full flex flex-col">
      <CardBody className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {project.name}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4">
          {project.description || "No description available"}
        </p>
        <div className="text-sm text-[var(--text-secondary)]">
          {project.taskCount} {project.taskCount === 1 ? "Task" : "Tasks"}
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <Link href={`/projects/${project?.id}`}>
          <Button variant="outline" size="sm">
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
