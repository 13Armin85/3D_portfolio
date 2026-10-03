import {
  Building2,
  ShoppingBag,
  Users,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import type { Project } from "@/lib/types";

// Decorative concept illustrations; project screenshots can be supplied separately.
export function ProjectArt({ project }: { project: Project }) {
  const Icon =
    project.id === "municipality"
      ? Building2
      : project.id === "shop"
        ? ShoppingBag
        : project.id === "members"
          ? Users
          : Code2;
  return (
    <div className={`project-art art-${project.color}`} aria-hidden="true">
      <div className="art-window">
        <div className="art-window-bar">
          <i />
          <i />
          <i />
          <span>{project.category}</span>
        </div>
        <div className="project-concept">
          <Icon size={32} strokeWidth={1.3} />
          <strong>{project.title}</strong>
          <div className="concept-modules">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech}>
                {tech}
                <ArrowUpRight size={10} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
