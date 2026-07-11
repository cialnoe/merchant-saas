"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { logout } from "@/actions/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function SidebarNav({
  email,
  locale,
  dict,
}: {
  email: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: dict.nav.overview, icon: LayoutDashboard },
    { href: "/dashboard/products", label: dict.nav.products, icon: Package },
    { href: "/dashboard/orders", label: dict.nav.orders, icon: ShoppingCart },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Boxes className="h-5 w-5 text-primary" />
          {dict.landing.brand}
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="hidden items-center justify-between border-b px-6 py-5 lg:flex">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Boxes className="h-6 w-6 text-primary" />
            {dict.landing.brand}
          </div>
        </div>
        <div className="hidden border-b px-3 py-3 lg:block">
          <LanguageSwitcher locale={locale} variant="outline" />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <p className="truncate px-3 py-1 text-xs text-muted-foreground">
            {email}
          </p>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              {dict.nav.logout}
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
