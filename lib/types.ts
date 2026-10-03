export type SectionId =
  "about" | "projects" | "skills" | "journey" | "resume" | "contact";
export type Vec3 = [number, number, number];
export type AssetId =
  | "desk"
  | "monitor"
  | "laptop"
  | "bookshelf"
  | "chair"
  | "plant"
  | "lamp"
  | "frames"
  | "resume"
  | "phone"
  | "accessories";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  technologies: string[];
  color: string;
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
}
