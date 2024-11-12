import {
  Briefcase,
  AppWindow,
  DatabaseZap,
  Bot,
  FileSearch,
  User,
  Icon,
  FileTextIcon,
  Globe
} from 'lucide-react';

export const menuitems = [
  {
    title: "Features",
    path: "#",
    children: [
      { title: "Personal Files", path: "/" },
      { title: "Community Files", path: "#" },
      { title: "Public Files", path: "#" },
      // { title: "404 Page", path: "/404" },
    ],
  },
  {
    title: "Pricing",
    path: "/pricing",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
  {
    title: "Pro",
    badge: true,
    path: "#",
  },
];

export const pricing = [
  {
    name: "Personal",
    price: "Free",
    popular: false,
    features: [
      "Lifetime free",
      "Up to 3 users",
      "Unlimited Pages",
      "Astro Sub domain",
      "Basic Integrations",
      "Community Support",
    ],
    button: {
      text: "Get Started",
      link: "/",
    },
  },
  {
    name: "Startup",
    price: {
      monthly: "$19",
      annual: "$16",
      discount: "10%",
      original: "$24",
    },
    popular: true,
    features: [
      "All Free Features",
      "Up to 20 users",
      "20 Custom domains",
      "Unlimited Collaborators",
      "Advanced Integrations",
      "Priority Support",
    ],
    button: {
      text: "Get Started",
      link: "#",
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    popular: false,
    features: [
      "All Pro Features",
      "Unlimited Custom domains",
      "99.99% Uptime SLA",
      "SAML & SSO Integration",
      "Dedicated Account Manager",
      "24/7 Phone Support",
    ],
    button: {
      text: "Contact us",
      link: "/contact",
    },
  },
];

export const features = [
  {
    title: "Advanced File Management",
    description:
      "Upload, view and manage multiple file types with both grid and table views. Supports images, PDFs, CSVs and more with built-in preview support.",
    icon: FileTextIcon,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Built with Convex backend for real-time data synchronization. See live updates when files are modified or status changes.",
    icon: DatabaseZap,
  },
  {
    title: "Secure Authentication",
    description:
      "Enterprise-grade authentication with Clerk, supporting organization-based access control and role management for team collaboration.",
    icon: User,
  },
  {
    title: "Global File Sharing",
    description:
      "Share files with anyone in the world with a simple link. No need to sign up or login. With Global Files, you can share files with anyone, anywhere.",
    icon: Globe,
  },
  {
    title: "Modern UI/UX",
    description:
      "Built with Shadcn UI components offering a responsive design that works seamlessly across desktop and mobile with dark/light theme support.",
    icon: AppWindow,
  },
  {
    title: "Team Workspace",
    description:
      "Collaborate with your team using organization features. Share files, manage access permissions, and work together efficiently.",
    icon: Briefcase,
  },
];