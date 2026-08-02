export default function GameHeader() {
  return (
    <header className="rounded-3xl border border-yellow-500/20 bg-zinc-900 px-8 py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
            DOSSIER SECRET
          </p>

          <h1 className="text-4xl font-black text-white">
            Pyramide du Gang
          </h1>
        </div>

        <div className="rounded-2xl bg-zinc-800 px-5 py-3">
          <p className="text-sm text-zinc-400">
            Statut
          </p>

          <p className="font-bold text-yellow-400">
            Partie en cours
          </p>
        </div>
      </div>
    </header>
  );
}