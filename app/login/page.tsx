import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const { locale, t } = getDictionary();
  return <LoginForm locale={locale} dict={t} />;
}
