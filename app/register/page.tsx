import { getDictionary } from "@/lib/i18n/get-dictionary";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  const { locale, t } = getDictionary();
  return <RegisterForm locale={locale} dict={t} />;
}
