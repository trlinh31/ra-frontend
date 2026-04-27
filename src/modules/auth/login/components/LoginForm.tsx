import logo from "@/assets/logo.avif";
import { loginWithCredentials, MOCK_USERS } from "@/modules/auth/login/data/auth.mock-store";
import { loginSchema, type LoginFormValues } from "@/modules/auth/login/schemas/login.schema";
import type { AuthSession } from "@/modules/auth/login/types/auth.type";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  Plane,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface LoginFormProps {
  onSuccess: (session: AuthSession) => void;
}

// ─── Danh sách tính năng hiển thị ở panel trái ───────────────────────────────
const FEATURES = [
  { icon: BarChart3, label: "Dashboard tổng quan hệ thống" },
  { icon: Plane,     label: "Quản lý Tour & Hành trình"   },
  { icon: FileText,  label: "Báo giá & Booking Tour"       },
  { icon: Users,     label: "Quản lý Nhà cung cấp"        },
  { icon: BarChart3, label: "Kế toán Thu – Chi"           },
];

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPw, setShowPw]       = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  const quickFill = (roleKey: string) => {
    const u = MOCK_USERS.find((x) => x.roleKey === roleKey);
    if (!u) return;
    form.setValue("email", u.email, { shouldValidate: false });
    form.setValue("password", u.password, { shouldValidate: false });
    form.clearErrors();
    setServerError("");
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const session = await loginWithCredentials(values.email, values.password);
      onSuccess(session);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[520px_1fr]">

      {/* ════════════════════════════════════════════════════════
          PANEL TRÁI — Brand / Navy
      ════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col bg-sidebar text-sidebar-foreground relative overflow-hidden">

        {/* Dot-grid decorative background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] rounded-full bg-sidebar-primary/15 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <img src={logo} alt="RA Travel" className="h-9 w-9 rounded-lg object-contain shrink-0" />
            <span className="text-base font-semibold tracking-tight">RA Travel</span>
          </div>

          {/* Headline */}
          <div className="py-14 space-y-4">
            <h2 className="text-3xl font-bold leading-snug tracking-tight">
              Quản lý du lịch<br />
              <span className="text-sidebar-primary">toàn diện & hiệu quả</span>
            </h2>
            <p className="text-sm text-sidebar-foreground/60 leading-relaxed max-w-xs">
              Nền tảng quản trị dành cho doanh nghiệp lữ hành — từ báo giá,
              điều hành đến kế toán trên một hệ thống duy nhất.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3 mb-auto">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
                  <Icon className="h-3.5 w-3.5 text-sidebar-primary" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          {/* Footer tagline */}
          <p className="mt-10 text-xs text-sidebar-foreground/40 border-t border-sidebar-border pt-6">
            © 2025 RA System · Bảo mật · Token hết hạn khi đóng tab
          </p>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          PANEL PHẢI — Login form
      ════════════════════════════════════════════════════════ */}
      <main className="flex items-center justify-center bg-background p-6 lg:p-10">
        <div className="w-full max-w-[380px] space-y-6">

          {/* Header (chỉ hiện trên mobile) */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <img src={logo} alt="RA Travel" className="h-8 w-8 rounded-lg object-contain shrink-0" />
            <span className="font-semibold">RA Travel</span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin tài khoản để tiếp tục
            </p>
          </div>

          {/* ── Server error ─────────────────────────────────── */}
          {serverError && (
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-lg border border-destructive/20",
                "bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive",
              )}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────── */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="ban@example.com"
                          className="pl-8"
                          autoComplete="username"
                          disabled={isSubmitting}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setServerError("");
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
                        onClick={() => alert("Chức năng đang phát triển 🚧")}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-8 pr-9"
                          autoComplete="current-password"
                          disabled={isSubmitting}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setServerError("");
                          }}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPw
                            ? <EyeOff className="h-3.5 w-3.5" />
                            : <Eye    className="h-3.5 w-3.5" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">tài khoản demo</span>
            <Separator className="flex-1" />
          </div>

          {/* ── Quick-fill ───────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2">
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => quickFill(u.roleKey)}
                className={cn(
                  "group flex flex-col items-start gap-0.5 rounded-lg border bg-card px-3 py-2.5",
                  "text-left text-xs transition-colors",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "disabled:pointer-events-none disabled:opacity-50",
                  // highlight nếu đang được chọn
                  form.watch("email") === u.email &&
                    "border-primary/50 bg-primary/5",
                )}
              >
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  {form.watch("email") === u.email && (
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                  )}
                  {u.role}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {u.email}
                </span>
              </button>
            ))}
          </div>

          {/* ── Footer note ──────────────────────────────────── */}
          <p className="text-center text-xs text-muted-foreground">
            Phiên đăng nhập lưu trong{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
              sessionStorage
            </code>
            {" "}— đóng tab là hết phiên.
          </p>
        </div>
      </main>
    </div>
  );
}
