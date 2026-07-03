import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Package,
  BarChart3,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  Boxes,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Boxes className="h-6 w-6 text-primary" />
            StockFlow
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-20 text-center sm:py-32">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
          Built for growing merchants
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Run your inventory and orders from one clean dashboard
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          StockFlow helps merchants track stock levels, manage orders end to
          end, and understand revenue at a glance — no spreadsheets required.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              I already have an account
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run the back office
          </h2>
          <p className="mt-3 text-muted-foreground">
            One workspace for products, orders, and the numbers that matter.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Package className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Product Catalog</CardTitle>
              <CardDescription>
                Create, edit, and track SKUs, pricing, and stock levels in one
                place.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShoppingCart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Order Management</CardTitle>
              <CardDescription>
                Move orders from Pending to Processing to Completed with a
                single click.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Live Analytics</CardTitle>
              <CardDescription>
                See total products, active orders, and revenue the moment you
                log in.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Secure by Default</CardTitle>
              <CardDescription>
                Your data is isolated per account with database-level row
                security.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 sm:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border bg-secondary/40 px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get organized?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Create your free account in under a minute. No credit card
            required.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Create your account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Boxes className="h-5 w-5" />
            StockFlow
          </div>
          <p>© {new Date().getFullYear()} StockFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
