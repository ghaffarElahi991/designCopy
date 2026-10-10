import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/social-icons";
import { siteContact } from "@/lib/site";
import { cn } from "@/lib/utils";

type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;

const channels: Array<{
  name: string;
  description: string;
  href: string;
  handle: string;
  icon: SocialIcon;
  accent: string;
  iconClass: string;
  cta: string;
}> = [
  {
    name: "WhatsApp",
    description: "Fastest way to order. Share a photo or bag name and we'll assist you.",
    href: siteContact.whatsappUrl,
    handle: siteContact.whatsappDisplay,
    icon: WhatsAppIcon,
    accent: "border-[#25D366]/25 bg-[#f0faf4] hover:border-[#25D366]/50",
    iconClass: "text-[#25D366]",
    cta: "Start chat",
  },
  {
    name: "Instagram",
    description: "See new arrivals, styling ideas, and message us directly.",
    href: siteContact.instagramUrl,
    handle: "New arrivals & styling",
    icon: InstagramIcon,
    accent: "border-rose/25 bg-blush/20 hover:border-rose/50",
    iconClass: "text-rose",
    cta: "Follow us",
  },
  {
    name: "Facebook",
    description: "Connect with our community and get updates on collections.",
    href: siteContact.facebookUrl,
    handle: "Join our community",
    icon: FacebookIcon,
    accent: "border-blue-200 bg-blue-50/50 hover:border-blue-300",
    iconClass: "text-blue-600",
    cta: "Visit page",
  },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <Link
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex flex-col rounded-sm border p-5 transition-all duration-300 hover:shadow-md",
              channel.accent
            )}
          >
            <Icon className={cn("h-7 w-7", channel.iconClass)} />
            <h3 className="mt-4 font-serif text-lg">{channel.name}</h3>
            <p className="mt-1 text-xs text-muted">{channel.handle}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {channel.description}
            </p>
            <span className="mt-4 text-xs font-medium uppercase tracking-wider text-foreground group-hover:text-gold">
              {channel.cta} →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
