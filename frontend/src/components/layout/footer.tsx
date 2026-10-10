import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/icons/social-icons";
import { siteContact } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-foreground text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.04em]">
            Silk <span className="italic text-champagne">Shadow</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream/65">
            Feminine luxury, thoughtfully curated with elegance and care.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-champagne">Company</h4>
          <ul className="space-y-2 text-sm text-cream/65">
            <li><Link href="/about" className="transition-colors hover:text-cream">About Us</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-champagne">Customer Service</h4>
          <ul className="space-y-2 text-sm text-cream/65">
            <li><Link href="/shipping" className="transition-colors hover:text-cream">Shipping Policy</Link></li>
            <li><Link href="/returns" className="transition-colors hover:text-cream">Returns</Link></li>
            <li><Link href="/faq" className="transition-colors hover:text-cream">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-champagne">Follow Us</h4>
          <div className="flex gap-4 text-cream/65">
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
              className="transition-colors hover:text-blush"
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
          <p className="mt-6 text-xs text-cream/55">We accept Visa, Mastercard, Amex, PayPal</p>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/55">
        © {new Date().getFullYear()} Silk Shadow. All rights reserved.
      </div>
    </footer>
  );
}
