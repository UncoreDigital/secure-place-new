import { Siren, Target, Users, PhoneCall, HeartPulse, GraduationCap } from "lucide-react";

/**
 * The six platform capabilities, as advertised on the live site.
 * Shared by the home page summary and the full /solutions page, so the two can
 * never drift apart.
 */
export const capabilities = [
  {
    id: "emergency-alert",
    image: "/assets/img/service/1.png",
    icon: Siren,
    title: "Emergency Alert",
    body: "Instantly notify everyone with critical updates during any crisis.",
    detail:
      "One tap from an employee's phone reaches security and trained volunteers at once, with the person's live location and emergency health information attached — so responders arrive knowing where to go and what they are walking into.",
    points: [
      "SOS from the app",
      "Real-time alert to security and volunteers",
      "Shares live location and health info",
    ],
  },
  {
    id: "drill-management",
    image: "/assets/img/service/emergency.jpg",
    icon: Target,
    title: "Drill Management",
    body: "Plan, conduct and analyse safety drills to ensure readiness for any emergency.",
    detail:
      "The disaster team launches a drill with a click; alarms go to employee phones. Participation and evacuation time are captured as the drill runs, so the report writes itself and the next drill has a number to beat.",
    points: [
      "Launch drills with a click",
      "Alarm sent to employee phones",
      "Participation and preparedness score",
    ],
  },
  {
    id: "employee-safety-data",
    image: "/assets/img/service/directory.png",
    icon: Users,
    title: "Employee Safety Data",
    body: "Centrally manage vital employee details and assign safety personnel per location.",
    detail:
      "Employee contact details, optional age and gender, and per-location assignment of guards and volunteers — so an alert from the third floor reaches the people who cover the third floor.",
    points: [
      "Manage employee contact info",
      "Optional age and gender fields",
      "Assign guards and volunteers per location",
    ],
  },
  {
    id: "contact-directory",
    image: "/assets/img/service/contact.png",
    icon: PhoneCall,
    title: "Contact Directory",
    body: "The right number to hand in any situation, without anyone having to look it up.",
    detail:
      "A company-level emergency contact list, with local police, fire and hospital numbers resolved automatically by the location a person is standing in.",
    points: [
      "Company-level emergency contacts",
      "Local police, fire and hospital auto-fetched by geolocation",
    ],
  },
  {
    id: "medical-training",
    image: "/assets/img/service/medical.jpg",
    icon: HeartPulse,
    title: "Medical Training",
    body: "Respond to workplace medical crises with expert-led guidance.",
    detail:
      "Basic life support and CPR, first-aid response for the injuries that actually happen at work, and scenario-based practical sessions — plus webinars with certified doctors for wider team awareness.",
    points: [
      "BLS and CPR training",
      "First-aid for common injuries",
      "Scenario-based practical sessions",
      "Webinars with certified doctors",
    ],
  },
  {
    id: "training-classes",
    image: "/assets/img/service/7.png",
    icon: GraduationCap,
    title: "Training Classes",
    body: "Certified trainers run awareness and compliance sessions for a harassment-free workplace.",
    detail:
      "Trainer-led sessions for employees, managers and Internal Complaints Committee members, with case studies and assessments — because those three groups carry genuinely different obligations.",
    points: [
      "Certified trainer-led sessions",
      "For employees, managers and ICC",
      "Includes case studies and assessments",
    ],
  },
] as const;
