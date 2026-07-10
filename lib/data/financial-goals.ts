/**
 * Static financial goal options used by the Financial Compass wizard.
 * These are UI choices, not generated user data.
 */

import { createElement } from "react";
import {
  Car,
  GraduationCap,
  Home,
  Laptop,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const FINANCIAL_GOALS = [
  { id: "higher-education", label: "Higher Education", icon: createElement(GraduationCap, { className: "w-7 h-7" }), description: "Fund your degree or certification" },
  { id: "emergency-fund", label: "Emergency Fund", icon: createElement(ShieldCheck, { className: "w-7 h-7" }), description: "Build a 6-month safety net" },
  { id: "start-business", label: "Start a Business", icon: createElement(Rocket, { className: "w-7 h-7" }), description: "Launch your entrepreneurial journey" },
  { id: "buy-laptop", label: "Buy a Laptop", icon: createElement(Laptop, { className: "w-7 h-7" }), description: "Invest in your productivity" },
  { id: "home", label: "Own a Home", icon: createElement(Home, { className: "w-7 h-7" }), description: "Plan for your dream property" },
  { id: "vehicle", label: "Buy a Vehicle", icon: createElement(Car, { className: "w-7 h-7" }), description: "Fund your two or four-wheeler" },
  { id: "other", label: "Other Goal", icon: createElement(Sparkles, { className: "w-7 h-7" }), description: "Define your custom financial goal" },
] as const;
