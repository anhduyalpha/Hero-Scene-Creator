export interface SocialEntry {
  platform: string;
  handle: string;
  href: string;
  color: string;
  icon: "github" | "linkedin" | "twitter" | "instagram" | "youtube" | "twitch" | "dribbble" | "figma" | "discord" | "devto" | "medium" | "codepen" | "globe";
}

export const socials: SocialEntry[] = [
  {
    platform: "GitHub",
    handle: "",
    href: "",
    color: "#ffffff",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    handle: "",
    href: "",
    color: "#0A66C2",
    icon: "linkedin",
  },
  {
    platform: "Twitter / X",
    handle: "",
    href: "",
    color: "#1DA1F2",
    icon: "twitter",
  },
  {
    platform: "Instagram",
    handle: "",
    href: "",
    color: "#E1306C",
    icon: "instagram",
  },
  {
    platform: "YouTube",
    handle: "",
    href: "",
    color: "#FF0000",
    icon: "youtube",
  },
  {
    platform: "Twitch",
    handle: "",
    href: "",
    color: "#9146FF",
    icon: "twitch",
  },
  {
    platform: "Dribbble",
    handle: "",
    href: "",
    color: "#EA4C89",
    icon: "dribbble",
  },
  {
    platform: "Figma",
    handle: "",
    href: "",
    color: "#F24E1E",
    icon: "figma",
  },
  {
    platform: "Discord",
    handle: "",
    href: "",
    color: "#5865F2",
    icon: "discord",
  },
  {
    platform: "Dev.to",
    handle: "",
    href: "",
    color: "#08090A",
    icon: "devto",
  },
  {
    platform: "Medium",
    handle: "",
    href: "",
    color: "#00ab6c",
    icon: "medium",
  },
  {
    platform: "CodePen",
    handle: "",
    href: "",
    color: "#ffffff",
    icon: "codepen",
  },
];

/** Only returns entries where href has been filled in */
export const activeSocials = socials.filter((s) => s.href.trim() !== "");
