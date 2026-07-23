"use client";


type ResponsePanelProps = {

  onCroire: () => void;

  onDouter: () => void;

};



export default function ResponsePanel({

  onCroire,

  onDouter,

}: ResponsePanelProps) {


  return (

    <div className="mt-6 bg-purple-900 rounded-xl p-5">


      <h2 className="text-2xl font-bold">

        🤔 Tu crois ce joueur ?

      </h2>



      <div className="flex gap-4 mt-5">


        <button

          onClick={onCroire}

          className="
          bg-green-500
          text-black
          px-6
          py-3
          rounded-xl
          font-bold
          "

        >

          ✅ Je le crois

        </button>




        <button

          onClick={onDouter}

          className="
          bg-red-500
          text-black
          px-6
          py-3
          rounded-xl
          font-bold
          "

        >

          ❌ Je le crois pas

        </button>


      </div>


    </div>

  );

}