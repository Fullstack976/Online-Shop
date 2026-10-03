import { redirect } from "next/navigation";
import { LogOut, ShieldAlert } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { DemoPill } from "@/components/shell/demo-pill";
import { Logo } from "@/components/shell/logo";
import { Shell } from "@/components/shell/shell";
import { UserMenu } from "@/components/shell/user-menu";
import { Button } from "@/components/ui/button";
import { getViewer } from "@/lib/auth";
import { STORE_URL } from "@/lib/env";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const viewer = await getViewer();

  if (viewer.mode === "supabase") {
    if (!viewer.user) redirect("/login");
    if (!viewer.isAdmin) return <AccessDenied email={viewer.user.email} />;
  }

  const topbarEnd =
    viewer.mode === "mock" ? (
      <DemoPill />
    ) : (
      <UserMenu name={viewer.user!.name} email={viewer.user!.email} role={viewer.role ?? "admin"} />
    );

  return (
    <Shell topbarEnd={topbarEnd} storeUrl={STORE_URL}>
      {children}
    </Shell>
  );
}

function AccessDenied({ email }: { email: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-12">
      <div className="animate-fade-in w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo tone="dark" />
        </div>
        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger">
            <ShieldAlert className="size-6" aria-hidden />
          </span>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-navy">Хандах эрхгүй</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Та <span className="font-semibold text-ink">{email}</span> хаягаар нэвтэрсэн ч энэ бүртгэл админ эрхгүй
            байна. Дэлгүүрийн эзэмшигчээс эрхийг тань <span className="font-semibold text-ink">admin</span> болгохыг
            хүснэ үү.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-lg bg-navy px-4 py-3 text-left text-[11.5px] leading-relaxed text-tan-200">
            {`update public.profiles\n   set role = 'admin'\n where email = '${email.replace(/'/g, "''")}';`}
          </pre>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="secondary" className="w-full">
              <LogOut aria-hidden />
              Гарах
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
