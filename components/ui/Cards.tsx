import { LucideIcon } from "lucide-react";

export function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-200">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100"><Icon size={22} /></div>
      </div>
    </div>
  );
}

export function PageBand({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="safe-area mx-auto max-w-7xl py-8"><h1 className="mb-5 text-3xl font-black neon-text">{title}</h1>{children}</section>;
}
