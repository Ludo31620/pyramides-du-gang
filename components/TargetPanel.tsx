"use client";


type TargetPanelProps = {

  nombreJoueurs: number;

  joueurQuiDonne: number;

  onChoisirCible: (
    cible: number
  ) => void;

};



export default function TargetPanel({

  nombreJoueurs,

  joueurQuiDonne,

  onChoisirCible,

}: TargetPanelProps) {


  return (

    <div className="mt-6 bg-blue-900 rounded-xl p-5">


      <h2 className="text-2xl font-bold">

        🎯 Choisir la cible

      </h2>


      <p className="mt-3">

        Joueur {joueurQuiDonne + 1},
        choisis qui reçoit les gorgées

      </p>



      <div className="flex gap-3 mt-5">


        {Array.from(
          { length: nombreJoueurs }
        ).map(
          (_, index) => (


            index !== joueurQuiDonne && (

              <button

                key={index}

                onClick={() =>
                  onChoisirCible(index)
                }

                className="
                bg-blue-400
                text-black
                px-5
                py-3
                rounded-xl
                font-bold
                "

              >

                Joueur {index + 1}

              </button>

            )


          )
        )}


      </div>


    </div>

  );

}