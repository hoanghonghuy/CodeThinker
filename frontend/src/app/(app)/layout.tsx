"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LocaleProvider, useLocale } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useLocale();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const toggleLocale = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname.startsWith("/dashboard");
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              {t.app.name}
            </span>
            <span className="text-xs text-muted-foreground">{t.app.versionTag}</span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4 text-sm text-muted-foreground">
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-foreground ${
                  isActive("/dashboard")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/challenges"
                className={`transition-colors hover:text-foreground ${
                  isActive("/challenges")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t.nav.challenges}
              </Link>
              <Link
                href="/tracks"
                className={`transition-colors hover:text-foreground ${
                  isActive("/tracks")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t.nav.tracks}
              </Link>
              <Link
                href="/achievements"
                className={`transition-colors hover:text-foreground ${
                  isActive("/achievements")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t.nav.achievements}
              </Link>
              <Link
                href="/profile"
                className={`transition-colors hover:text-foreground ${
                  isActive("/profile")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t.nav.profile}
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={toggleLocale}
                className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {locale === "vi" ? t.common.languageEn : t.common.languageVi}
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user.displayName?.slice(0, 2)?.toUpperCase() ?? "ME"}
                  </div>
                  <div className="hidden text-right sm:flex sm:flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{user.email}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {!loading && !user && (
          <div className="border-t bg-muted px-4 py-2 text-xs text-muted-foreground">
            Bạn đang trải nghiệm dữ liệu mock. Đăng nhập để đồng bộ thử thách, lộ trình và tiến độ thật.
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <Toaster />
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LocaleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppShell>{children}</AppShell>
      </ThemeProvider>
    </LocaleProvider>
  );
}
