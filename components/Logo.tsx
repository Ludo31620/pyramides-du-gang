export default function Logo() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">♠️</div>

      <h1 className="text-6xl font-bold tracking-widest text-yellow-500">
        PYRAMIDES
      </h1>

      <h2 className="text-4xl font-semibold text-white mt-2">
        DU GANG
      </h2>

      <div className="flex justify-center gap-8 mt-4 text-2xl">
        <span>♥️</span>
        <span>♦️</span>
        <span>♣️</span>
      </div>

      <p className="text-gray-400 italic mt-5">
        Le jeu où la vérité est facultative.
      </p>
    </div>
  );
}