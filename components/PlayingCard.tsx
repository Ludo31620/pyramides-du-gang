import { Carte } from "@/lib/deck";

type PlayingCardProps = {
  carte: Carte;
  onClick?: () => void;
};

export default function PlayingCard({
  carte,
  onClick,
}: PlayingCardProps) {
  const estRouge =
    carte.couleur === "♥" ||
    carte.couleur === "♦";


  return (
    <div
      className="
        w-24
        h-36
        perspective
      "
    >
<button
  onClick={carte.revelee ? undefined : onClick}
  disabled={carte.revelee}
  className={`
  relative
  w-full
  h-full
  transition-transform
  duration-700
  transform-style-preserve-3d
  ${
    carte.revelee
      ? "rotate-y-180 cursor-default"
      : "cursor-pointer"
  }
`}
      >

        {/* DOS DE CARTE */}
        <div
          className="
            absolute
            inset-0
            backface-hidden
            rounded-2xl
            bg-gradient-to-br
            from-blue-800
            to-blue-500
            border-2
            border-white/70
            shadow-xl
            flex
            items-center
            justify-center
          "
        >
          <span className="text-4xl">
            🂠
          </span>
        </div>


        {/* FACE DE CARTE */}
        <div
          className={`
            absolute
            inset-0
            backface-hidden
            rotate-y-180
            bg-white
            rounded-2xl
            shadow-xl
          `}
        >

          <div
            className={`
              absolute
              top-2
              left-3
              font-bold
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
            `}
          >
            <p className="text-xl">
              {carte.valeur}
            </p>

            <p className="text-2xl">
              {carte.couleur}
            </p>
          </div>


          <div
            className={`
              h-full
              flex
              items-center
              justify-center
              text-5xl
              font-bold
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
            `}
          >
            {carte.couleur}
          </div>


          <div
            className={`
              absolute
              bottom-2
              right-3
              rotate-180
              font-bold
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
            `}
          >
            <p className="text-xl">
              {carte.valeur}
            </p>

            <p className="text-2xl">
              {carte.couleur}
            </p>
          </div>

        </div>

      </button>
    </div>
  );
}