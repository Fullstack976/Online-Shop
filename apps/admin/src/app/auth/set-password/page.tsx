import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { SetPasswordCard } from "./set-password-card";

export const metadata: Metadata = { title: "Нууц үг тохируулах" };

/**
 * Public landing page for Supabase invite and password-recovery links
 * (the proxy lets `/auth/*` through without a session).
 */
export default function SetPasswordPage() {
  return (
    <AuthShell
      footer={
        <>
          <ShieldCheck className="mt-px size-4 shrink-0 text-tan" aria-hidden />
          Нууц үгээ хэнд ч бүү хэлээрэй. ShopLuxe-ийн ажилтнууд таны нууц үгийг хэзээ ч асуухгүй.
        </>
      }
    >
      <SetPasswordCard />
    </AuthShell>
  );
}
