"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
];

export function SidebarNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Boxes className="h-5 w-5 text-primary" />
          StockFlow
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
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
        <div className="hidden items-center gap-2 border-b px-6 py-5 font-bold text-lg lg:flex">
          <Boxes className="h-6 w-6 text-primary" />
          StockFlow
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
              Log out
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
