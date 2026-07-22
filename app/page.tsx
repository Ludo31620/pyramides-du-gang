import Logo from "@/components/Logo";
import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Logo />

        <div className="mt-12 space-y-4">
          <Button href="/creer">
            🎮 Créer une partie
          </Button>

          <Button variant="secondary">
            🤝 Rejoindre une partie
          </Button>

          <Button variant="secondary">
            📖 Règles
          </Button>

          <Button variant="secondary">
            ⚙️ Paramètres
          </Button>
        </div>

        <p className="text-center text-gray-500 mt-10 text-sm">
          by Ludo B
        </p>
      </div>
    </main>
  );
}