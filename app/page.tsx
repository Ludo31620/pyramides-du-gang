import Link from "next/link";

import HomeMenu from "@/components/home/HomeMenu";

export default function HomePage() {
  return (
    <main
      className="
        relative
        flex
        min-h-screen
        overflow-hidden
        bg-[var(--color-background)]
        px-5
        py-6
        text-[var(--color-text)]
        transition-colors
        duration-200
      "
    >
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
          opacity-[0.06]
        "
        style={{
          backgroundColor:
            "var(--color-primary)",
        }}
      />

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
          opacity-[0.04]
        "
        style={{
          backgroundColor:
            "var(--color-primary)",
        }}
      />

      <HomeMenu />

      <section
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-3rem)]
          w-full
          max-w-md
          flex-col
          items-center
          justify-center
        "
      >
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
          <span className="text-[var(--color-text)]">
            ♠
          </span>

          <span className="text-red-500">
            ♥
          </span>

          <span className="text-red-500">
            ♦
          </span>

          <span className="text-[var(--color-text)]">
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
          Pyramide

          <span
            className="
              mt-2
              block
              text-[var(--color-primary)]
              transition-colors
              duration-200
            "
          >
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
              border
              border-[var(--color-primary)]
              bg-[var(--color-primary)]
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-[var(--color-primary-text)]
              shadow-lg
              transition
              duration-200
              hover:bg-[var(--color-primary-hover)]
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
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-[var(--color-text)]
              transition
              duration-200
              hover:border-[var(--color-primary)]
              hover:bg-[var(--color-surface-elevated)]
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