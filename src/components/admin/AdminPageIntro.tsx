type AdminPageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminPageIntro({ eyebrow, title, description }: AdminPageIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.32em] text-bordeaux/65">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-ink">{title}</h1>
      <p className="mt-4 text-base leading-7 text-charcoal/74">{description}</p>
    </div>
  );
}
