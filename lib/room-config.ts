import type { AssetId, SectionId, Vec3 } from "@/lib/types";

// Models share a local origin and meter-based scale. Replace a URL here to swap
// the visual without changing navigation, content, or interaction components.
export const roomAssets: Record<AssetId, string> = {
  desk: "/models/desk.glb",
  monitor: "/models/monitor.glb",
  laptop: "/models/laptop.glb",
  bookshelf: "/models/bookshelf.glb",
  chair: "/models/chair.glb",
  plant: "/models/plant.glb",
  lamp: "/models/lamp.glb",
  frames: "/models/frames.glb",
  resume: "/models/resume.glb",
  phone: "/models/phone.glb",
  accessories: "/models/accessories.glb",
};

export const sections: {
  id: SectionId;
  label: string;
  object: string;
  description: string;
}[] = [
  {
    id: "about",
    label: "About",
    object: "The monitor",
    description: "The person behind the pixels.",
  },
  {
    id: "projects",
    label: "Projects",
    object: "The laptop",
    description: "Ideas turned into real applications.",
  },
  {
    id: "skills",
    label: "Skills",
    object: "The bookshelf",
    description: "Tools I reach for every day.",
  },
  {
    id: "journey",
    label: "Journey",
    object: "The wall",
    description: "Experience, education, and growth.",
  },
  {
    id: "resume",
    label: "Résumé",
    object: "The document",
    description: "My experience, all in one place.",
  },
  {
    id: "contact",
    label: "Contact",
    object: "The phone",
    description: "Every good project starts with hello.",
  },
];

export const overview = {
  position: [9.2, 7.1, 10.5] as Vec3,
  target: [0, 1.45, 0] as Vec3,
};
export const cameraViews: Record<SectionId, { position: Vec3; target: Vec3 }> =
  {
    about: { position: [3.9, 3.7, 5.3], target: [-0.7, 1.95, -1] },
    projects: { position: [2.1, 3.8, 4.5], target: [-1.65, 1.55, -0.75] },
    skills: { position: [4, 3.5, 5.8], target: [1.8, 1.65, -1.65] },
    journey: { position: [3.5, 3.4, 5], target: [-0.4, 3.1, -2.3] },
    resume: { position: [4, 4.8, 4], target: [0.7, 1.5, -0.65] },
    contact: { position: [4.5, 3.8, 4.5], target: [0.95, 1.6, -0.9] },
  };
