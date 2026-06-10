import {
  Facebook,
  Github,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";

function Footer() {
  const t = useTranslations("footer");
  const tMenu = useTranslations("menu");
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Github, href: "https://github.com", label: "Github" },
  ];

  const quickLinks = [
    { label: tMenu("home"), href: "/" },
    { label: tMenu("missions"), href: "/missions" },
    { label: tMenu("exchange"), href: "/exchange-market" },
    { label: tMenu("community"), href: "/community" },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-12 text-slate-600 transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4 md:col-span-5">
            <Link
              href="/"
              className="flex w-fit items-center space-x-2.5 transition-transform select-none active:scale-95"
            >
              <img
                src="/images/Logo-Greenflag.png"
                className="h-9 w-9 object-contain md:h-10 md:w-10"
                alt="Green Flag Logo"
              />
              <span className="text-xl font-extrabold tracking-tight text-[#0B6E4F] dark:text-emerald-500">
                Green Flag
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed">{t("aboutDesc")}</p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-200/50 p-2 text-slate-500 transition-all duration-300 hover:bg-[#0B6E4F] hover:text-white active:scale-90 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4 md:col-span-3">
            <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-200">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors duration-200 hover:text-[#0B6E4F] dark:hover:text-emerald-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col space-y-4 md:col-span-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-200">
              {t("contact")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-[#0B6E4F] dark:text-emerald-500" />
                <span>{t("address")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 shrink-0 text-[#0B6E4F] dark:text-emerald-500" />
                <span>{t("phone")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 shrink-0 text-[#0B6E4F] dark:text-emerald-500" />
                <span>{t("email")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs sm:flex-row dark:border-zinc-800/80">
          <p>{t("allRightsReserved", { year: currentYear })}</p>
          <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <Leaf className="h-4 w-4 animate-pulse" />
            <span>Protecting our Earth together</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
