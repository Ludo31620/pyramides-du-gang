"use client";


type DonPanelProps = {

  onChoisirGorgees: (
    nombre: number
  ) => void;

};


export default function DonPanel({

  onChoisirGorgees,

}: DonPanelProps) {


  return (

    <div className="mt-6 bg-red-900 rounded-xl p-5">


      <h2 className="text-2xl font-bold">
        🍺 Combien de gorgées ?
      </h2>



      <div className="flex gap-3 mt-5">


        {[1,2,3,4].map(
          (nombre) => (

            <button

              key={nombre}

              onClick={() =>
                onChoisirGorgees(nombre)
              }

              className="
              bg-red-500
              text-black
              px-5
              py-3
              rounded-xl
              font-bold
              "

            >

              {nombre}

            </button>

          )
        )}


      </div>


    </div>

  );

}