"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthFormState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Boxes, Loader2 } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const initialState: AuthFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </Button>
  );
}

export function LoginForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction] = useFormState(login, initialState);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const t = dict.auth;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Boxes className="h-6 w-6 text-primary" />
            {dict.landing.brand}
          </Link>
          <LanguageSwitcher locale={locale} variant="outline" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t.welcomeBack}</CardTitle>
            <CardDescription>{t.loginSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {justRegistered && (
              <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {t.registeredBanner}
              </div>
            )}
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@business.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <SubmitButton label={t.loginButton} />
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t.noAccount}{" "}
              <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                {t.signUp}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
