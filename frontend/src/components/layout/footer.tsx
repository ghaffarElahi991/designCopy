import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/social-icons";
import { siteContact } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-serif text-2xl">
            Luxe<span className="text-gold">.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Premium women&apos;s fashion curated with elegance and care.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/shipping" className="hover:text-foreground">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider">Follow Us</h4>
          <div className="flex gap-4 text-muted">
            <a
              href={siteContact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transition-colors hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={siteContact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-rose"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={siteContact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-blue-600"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-6 text-xs text-muted">We accept Visa, Mastercard, Amex, PayPal</p>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Luxe Fashion. All rights reserved.
      </div>
    </footer>
  );
}
