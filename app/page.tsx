import Link from 'next/link'
import { Truck, Shield, Users, Package, ArrowRight, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Truck className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              جمّال
            </h1>
            <p className="mb-2 text-xl text-primary font-medium">
              Jammal Freight Marketplace
            </p>
            <p className="max-w-2xl text-lg text-muted-foreground">
              منصة الشحن الرائدة في المملكة العربية السعودية - نربط الشاحنين بالسائقين لنقل البضائع بكفاءة وأمان
            </p>
          </div>
        </div>
      </header>

      {/* Portal Selection */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
          اختر لوحة التحكم
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Admin Portal */}
          <Link
            href="/admin"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                لوحة تحكم المدير
              </h3>
              <p className="mb-6 text-muted-foreground">
                إدارة شاملة للمنصة - المستخدمين، الشحنات، الإحصائيات، والتقارير
              </p>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  إحصائيات ورسوم بيانية شاملة
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  إدارة المستخدمين والسائقين
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  متابعة جميع الشحنات
                </li>
              </ul>
              <div className="flex items-center gap-2 font-medium text-primary">
                الدخول للوحة المدير
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Broker Portal */}
          <Link
            href="/broker"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                لوحة تحكم الوسيط
              </h3>
              <p className="mb-6 text-muted-foreground">
                إدارة الأسطول والسائقين - للشركات وأصحاب الأساطيل
              </p>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  إدارة مركبات الأسطول
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  إدارة السائقين والتعيينات
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  متابعة شحنات الأسطول
                </li>
              </ul>
              <div className="flex items-center gap-2 font-medium text-primary">
                الدخول للوحة الوسيط
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            مميزات المنصة
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: 'تتبع مباشر', desc: 'تتبع الشحنات في الوقت الفعلي' },
              { icon: Shield, title: 'أمان عالي', desc: 'حماية البيانات والمعاملات' },
              { icon: Users, title: 'سائقون موثوقون', desc: 'شبكة سائقين معتمدين' },
              { icon: BarChart3, title: 'تقارير شاملة', desc: 'إحصائيات وتحليلات متقدمة' },
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            جمّال - منصة الشحن السعودية | Jammal Freight Marketplace
          </p>
        </div>
      </footer>
    </div>
  )
}
