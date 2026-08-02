import Link from "next/link";

import HomeMenu from "@/components/home/HomeMenu";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#0B0E13] px-5 py-6 text-white">
      {/* Halo supérieur */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-12rem]
          h-[24rem]
          w-[24rem]
          -translate-x-1/2
          rounded-full
          bg-yellow-400/5
          opacity-70
        "
      />

      {/* Halo inférieur */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-10rem]
          right-[-8rem]
          h-[20rem]
          w-[20rem]
          rounded-full
          bg-amber-700/5
          opacity-60
        "
      />

      <HomeMenu />

      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col items-center justify-center">
        <div
          aria-hidden="true"
          className="
            flex
            items-center
            gap-4
            text-3xl
            sm:text-4xl
          "
        >
          <span className="text-zinc-100">
            ♠
          </span>

          <span className="text-red-500">
            ♥
          </span>

          <span className="text-red-500">
            ♦
          </span>

          <span className="text-zinc-100">
            ♣
          </span>
        </div>

        <h1
          className="
            mt-8
            text-center
            text-5xl
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.05em]
            sm:text-6xl
          "
        >
          Pyramides

          <span className="mt-2 block text-yellow-400">
            du Gang
          </span>
        </h1>

        <div className="mt-16 w-full space-y-4">
          <Link
            href="/creer"
            className="
              flex
              min-h-16
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-yellow-400
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-zinc-950
              shadow-lg
              transition
              hover:bg-yellow-300
              active:scale-[0.98]
            "
          >
            Créer une partie
          </Link>

          <Link
            href="/rejoindre"
            className="
              flex
              min-h-16
              w-full
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-zinc-900
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-white
              transition
              hover:border-yellow-400/30
              hover:bg-zinc-800
              active:scale-[0.98]
            "
          >
            Rejoindre une partie
          </Link>
        </div>
      </section>
    </main>
  );
}