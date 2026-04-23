export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-gold">CavePlus</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-cream/75">
            Selection de vins, champagnes et spiritueux pensee pour les belles tables, les cadeaux et les celebrations a Abidjan.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold/80">Visiter</p>
          <div className="mt-3 space-y-2 text-sm text-cream/75">
            <p>Champagnes de reception</p>
            <p>Vins pour la table et la cave</p>
            <p>Spiritueux a offrir ou deguster</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold/80">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-cream/75">
            <p>Abidjan, Cocody</p>
            <p>+225 07 00 00 00 00</p>
            <p>contact@caveplus.ci</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
