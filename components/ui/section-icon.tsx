import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  FolderCode,
  Mail,
  UserRound,
  type LucideProps,
} from "lucide-react";
import type { SectionId } from "@/lib/types";

const icons = {
  about: UserRound,
  projects: FolderCode,
  skills: BookOpen,
  journey: BriefcaseBusiness,
  resume: FileText,
  contact: Mail,
};
export function SectionIcon({
  section,
  ...props
}: LucideProps & { section: SectionId }) {
  const Icon = icons[section];
  return <Icon {...props} />;
}
