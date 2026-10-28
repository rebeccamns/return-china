"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import Image from "next/image";

const DEMO_ROUTES = [
  { label: "Operational", description: "PMC Entry & WO", href: "/operational" },
  { label: "Exim", description: "Export processing", href: "/exim" },
  {
    label: "Staff Return",
    description: "Material & carton handling",
    href: "/staff-return/MO-321654987",
  },
  {
    label: "Staff Return Sticker",
    description: "Carton sticker scanning",
    href: "/staff-return-sticker",
  },
  { label: "IQC", description: "Quality inspection", href: "/iqc" },
  {
    label: "Superadmin",
    description: "System monitoring",
    href: "/superadmin",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Frontend-only demo: no real authentication.
    // The login form redirects to the default workflow.
    router.push("/operational");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-12 text-slate-900">
      {/* Organic background gradient wave shapes inspired by the sidebar design */}
 <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-44 h-[420px] w-[420px] rounded-full border border-emerald-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-[280px] w-[280px] rounded-full bg-emerald-50/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-40 h-[480px] w-[480px] rounded-full border border-emerald-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -left-32 h-[320px] w-[320px] rounded-full bg-emerald-50/80 blur-3xl"
      />

      <section className="relative z-10 w-full max-w-[420px]">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mb-8 inline-flex flex-col items-center">
            <div className="relative h-8 w-28">
      <Image
        src="/oppo-logo.png"
        alt="OPPO Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
    <span className="mt-2 text-[10px] font-medium tracking-wide text-slate-600">
      Indonesia Manufacturing
    </span>
          </div>

          <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
            Selamat datang kembali
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk untuk melanjutkan Return China.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="nik"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              NIK
            </label>

            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
              <UserRound className="h-[18px] w-[18px] shrink-0 text-slate-400" />

              <input
                id="nik"
                name="nik"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                placeholder="Masukkan NIK Anda"
                value={nik}
                onChange={(event) => setNik(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10">
              <LockKeyhole className="h-[18px] w-[18px] shrink-0 text-slate-400" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                required
              />

              <button
                type="button"
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="shrink-0 text-slate-400 transition hover:text-emerald-700"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#087443] to-[#05613a] text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-[0.99]"
          >
            Masuk
            <ArrowRight className="h-[18px] w-[18px]" />
          </button>


        </form>

        {/* Demo navigation */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">atau akses demo</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-800">
            Pilih workflow
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {DEMO_ROUTES.map((route) => (
            <button
              key={route.href}
              type="button"
              onClick={() => router.push(route.href)}
              className="group rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              <span className="block text-sm font-medium text-slate-800 group-hover:text-emerald-800">
                {route.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                {route.description}
              </span>
            </button>
          ))}
        </div>

      </section>
    </main>
  );
}