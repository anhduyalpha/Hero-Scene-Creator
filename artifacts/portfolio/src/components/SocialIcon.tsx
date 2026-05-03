import { Github, Linkedin, Twitter, Instagram, Youtube, Twitch, Dribbble, Figma, Globe } from "lucide-react";
import type { SocialEntry } from "../config/socials";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

function DevToIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.74 0 .74.04 0 .14-1.67 6.38-1.8 6.68z"/>
    </svg>
  );
}

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  );
}

function CodePenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19a1.024 1.024 0 0 0-1.142 0L.453 7.502l-.015.017-.044.04-.06.045-.046.03-.06.044-.044.06-.03.05-.035.067-.02.05c-.011.025-.02.05-.029.075l-.017.05-.018.087v7.638c0 .5.36.93.857 1.016l11 1.967.076.014.05.003h.257l.05-.003.073-.014 11-1.967c.5-.088.857-.518.857-1.016V8.182zm-7.6 6.336l-3.4 2.427v-3.35l-4.8-2.826-2.4 1.715V7.9l2.4-1.715 4.8 2.826v-3.35l3.4 2.427V14.518z"/>
    </svg>
  );
}

const iconMap: Record<SocialEntry["icon"], React.ComponentType<{ className?: string }>> = {
  github:    (p) => <Github    {...p} aria-hidden="true" />,
  linkedin:  (p) => <Linkedin  {...p} aria-hidden="true" />,
  twitter:   (p) => <Twitter   {...p} aria-hidden="true" />,
  instagram: (p) => <Instagram {...p} aria-hidden="true" />,
  youtube:   (p) => <Youtube   {...p} aria-hidden="true" />,
  twitch:    (p) => <Twitch    {...p} aria-hidden="true" />,
  dribbble:  (p) => <Dribbble  {...p} aria-hidden="true" />,
  figma:     (p) => <Figma     {...p} aria-hidden="true" />,
  discord:   (p) => <DiscordIcon  {...p} />,
  devto:     (p) => <DevToIcon    {...p} />,
  medium:    (p) => <MediumIcon   {...p} />,
  codepen:   (p) => <CodePenIcon  {...p} />,
  globe:     (p) => <Globe     {...p} aria-hidden="true" />,
};

export function SocialIcon({
  icon,
  className = "w-5 h-5",
}: {
  icon: SocialEntry["icon"];
  className?: string;
}) {
  const Icon = iconMap[icon] ?? iconMap.globe;
  return <Icon className={className} />;
}
