import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  Package,
  BarChart3,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  Boxes,
} from "lucide-react";

export default function LandingPage() {
  const { locale, t } = getDictionary();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Boxes className="h-6 w-6 text-primary" />
            {t.landing.brand}
          </div>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} variant="outline" />
            <Link href="/login">
              <Button variant="ghost">{t.landing.login}</Button>
            </Link>
            <Link href="/register">
              <Button>{t.landing.getStarted}</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-20 text-center sm:py-32">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
          {t.landing.badge}
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          {t.landing.heroTitle}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {t.landing.heroSubtitle}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              {t.landing.startFree} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              {t.landing.haveAccount}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.landing.featuresTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{t.landing.featuresSubtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Package className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">{t.landing.feature1Title}</CardTitle>
              <CardDescription>{t.landing.feature1Desc}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShoppingCart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">{t.landing.feature2Title}</CardTitle>
              <CardDescription>{t.landing.feature2Desc}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">{t.landing.feature3Title}</CardTitle>
              <CardDescription>{t.landing.feature3Desc}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">{t.landing.feature4Title}</CardTitle>
              <CardDescription>{t.landing.feature4Desc}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 sm:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border bg-secondary/40 px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.landing.ctaTitle}
          </h2>
          <p className="max-w-md text-muted-foreground">{t.landing.ctaSubtitle}</p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              {t.landing.ctaButton} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Boxes className="h-5 w-5" />
            {t.landing.brand}
          </div>
          <p>
            © {new Date().getFullYear()} {t.landing.brand}. {t.landing.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
}
