type AdminStatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function AdminStatCard({ label, value, hint }: AdminStatCardProps) {
  return (
    <div className="glass-card rounded-[20px] border border-mist p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-charcoal/60">{label}</p>
      <p className="mt-4 font-display text-3xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-charcoal/70">{hint}</p>
    </div>
  );
}
