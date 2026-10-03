import type { Project } from "@/lib/types";

// Transcribed or summarized from Armin_Nataj_Full_Stack_Resume.pdf.
export const profile = {
  name: "Armin Nataj",
  shortName: "Armin",
  initials: "AN",
  role: "Full Stack Developer",
  location: "Tehran, Iran",
  timezone: "Asia/Tehran",
  timezoneLabel: "IRST",
  utcOffset: "UTC +03:30",
  email: "natajarmin@gmail.com",
  phone: "+989906821298",
  github: "https://github.com/13Armin85",
  linkedin: "https://linkedin.com/in/armin-nataj",
  resume: "/resume/Armin_Nataj_Full_Stack_Resume.pdf",
  resumeFilename: "Armin_Nataj_Full_Stack_Resume.pdf",
  website: "https://arminnataj.ir/",
  photo: "/Armin-Nataj.png",
  logo: "/armin_logo_simple.svg",
  intro:
    "I build end-to-end web experiences, from responsive React and Next.js interfaces to reliable APIs and backend services. Explore my workspace and the work behind the screen.",
  bio: "I’m Armin, a Full Stack Developer based in Tehran, Iran. I build and maintain web applications with React, Next.js, TypeScript, Node.js, Django, and C#/.NET, with a focus on clean code and reliable user experiences.",
  approach:
    "My work connects responsive interfaces, RESTful APIs, and client-server data flow. I enjoy debugging across the stack, improving performance, and building reusable components. I also develop custom WordPress themes and plugins, with attention to SEO, speed, and maintainability.",
  current:
    "At Amard, I develop React and Next.js interfaces alongside C#/.NET backend services and RESTful APIs. Alongside my development work, I’m studying Electrical Engineering at Islamic Azad University, Central Tehran Branch.",
  facts: [
    { value: "Full stack", label: "React & Next.js · APIs & backend services" },
    { value: "Persian / English", label: "Native Persian · Advanced English" },
  ],
};

export const projects: Project[] = [
  {
    id: "municipality",
    title: "Municipality Management System",
    category: "Public services · Web platform",
    description:
      "An online platform bringing property registration, inquiries, and municipal administration into one workflow.",
    details: [
      "Property registration and record management modules.",
      "Inquiry handling and administrative workflow modules.",
    ],
    technologies: [
      "Web Application",
      "Property Registration",
      "Administrative Workflows",
    ],
    color: "sage",
  },
  {
    id: "shop",
    title: "Shop (Next.js)",
    category: "E-commerce · Storefront",
    description:
      "An e-commerce storefront built with Next.js and TypeScript, connecting product discovery to checkout.",
    details: [
      "Product listing and browsing interfaces.",
      "Checkout flow built with Next.js and TypeScript.",
    ],
    technologies: ["Next.js", "TypeScript", "E-commerce", "Checkout"],
    color: "peach",
  },
  {
    id: "members",
    title: "Member Management App",
    category: "Management · Web application",
    description:
      "A TypeScript application for managing member records and profiles.",
    details: [
      "Member record management.",
      "Profile management with TypeScript.",
    ],
    technologies: ["TypeScript", "Member Records", "Profile Management"],
    color: "blue",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    category: "Personal website · Portfolio",
    description:
      "A React and TypeScript portfolio showcasing my projects, technical skills, and development experience.",
    details: [
      "Selected projects and technical skills.",
      "Professional experience and contact information.",
    ],
    technologies: ["React", "TypeScript", "Responsive Design"],
    color: "sage",
    liveUrl: profile.website,
  },
];

export const wordpressProjects = [
  "berkehketab.ir",
  "iranianetemad.ir",
  "negahhospital.com",
  "amardco.com",
  "raeesiedu.com",
  "19-16.ir",
  "ninielma.com",
  "stpilates.ir",
  "goldaneh.ir",
  "paionco.ir",
  "teknololeh.ir",
  "zarabannoor.com",
];

export const skillGroups = [
  {
    title: "Frontend & interfaces",
    note: "Responsive experiences across devices",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript / ES6+",
      "Tailwind CSS",
      "Redux",
      "HTML5",
      "CSS3",
      "Responsive & Mobile-First Design",
    ],
  },
  {
    title: "Backend, APIs & infrastructure",
    note: "Reliable services and connected applications",
    skills: [
      "Node.js",
      "C# / .NET",
      "Python",
      "Django",
      "Django REST Framework",
      "RESTful APIs",
      "SQL",
      "Microsoft SQL Server",
      "IIS",
      "Docker",
      "WordPress",
    ],
  },
  {
    title: "Tools, delivery & analytics",
    note: "From collaboration to performance",
    skills: [
      "Git",
      "Azure DevOps / TFS",
      "Jira",
      "Figma",
      "Adobe Photoshop",
      "Agile Workflow",
      "Debugging",
      "Performance Optimization",
      "SEO Optimization",
      "Google Search Console",
      "Google Analytics",
    ],
  },
];

// Dates preserve the supplied résumé, including overlapping roles.
export const experience = [
  {
    role: "Full-Stack Developer",
    company: "Amard",
    period: "May 2025 — Present",
    location: "Amol, Iran",
    details: [
      "Develop and maintain React.js and Next.js interfaces alongside C#/.NET backend services and RESTful APIs.",
      "Troubleshoot client-server data flow, API integration, and application defects across the full stack.",
      "Refactor reusable components and responsive layouts to improve performance and cross-device consistency.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "ISIRAN",
    period: "Dec 2024 — May 2025",
    location: "Tehran, Iran",
    details: [
      "Connected React applications to Node.js services by building, consuming, and validating RESTful API workflows.",
      "Improved server-side logic and clarified data flow between frontend components and backend services.",
      "Reduced maintenance overhead through reusable components and structured full-stack debugging practices.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Parand Tech Group",
    period: "May 2025 — Dec 2025",
    location: "Tehran, Iran",
    details: [
      "Built and maintained responsive web features integrated with backend services and APIs.",
      "Resolved cross-browser rendering and client-server integration issues using JavaScript, Flexbox, Grid, and Media Queries.",
      "Optimized application interfaces to maintain stable performance during continuous product updates.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Iran Fava Gostaresh",
    period: "Sep 2024 — Apr 2025",
    location: "Tehran, Iran",
    details: [
      "Implemented complex business logic in React.js and Next.js and integrated it with backend REST APIs.",
      "Collaborated across the stack to ensure accurate, timely data exchange between services and user interfaces.",
      "Diagnosed performance bottlenecks and improved page-load speed and application reliability.",
    ],
  },
  {
    role: "WordPress Developer",
    company: "Iranian Etemad",
    period: "Jun 2024 — Nov 2024",
    location: "Tehran, Iran",
    details: [
      "Delivered custom WordPress themes and plugins for e-commerce and corporate websites.",
      "Improved SEO, site speed, reliability, and ongoing maintainability across multiple client projects.",
    ],
  },
  {
    role: "Programming Intern",
    company: "Amard",
    period: "Jul 2022 — Aug 2023",
    location: "Amol, Iran",
    details: [
      "Built small desktop applications and strengthened foundations in OOP, debugging, clean code, and the software development lifecycle.",
    ],
  },
];

export const education = [
  {
    institution: "Islamic Azad University, Central Tehran Branch",
    degree: "Bachelor of Electrical Engineering",
    period: "2024 — Present",
    detail: "In progress · Tehran, Iran",
  },
  {
    institution: "Tehran",
    degree: "Diploma in Mathematics & Physics",
    period: "2020 — 2023",
    detail: "Tehran, Iran",
  },
];

export const softSkills = [
  "Problem Solving & Analytical Thinking",
  "Team Collaboration & Agile Workflow",
  "Effective Communication",
  "Adaptability & Continuous Learning",
  "Time Management",
];

export const languages = [
  { name: "Persian", level: "Native" },
  { name: "English", level: "Advanced · Written & spoken" },
];
