"use client";

import { useState } from "react";

import {
  creerPartie,
  retournerCartePyramide,
  retournerProchaineCarte,
  passerJoueur,
  commencerDon,
  choisirGorgees,
  choisirCible,
  reponseCroire,
  reponseDouter,
  terminerTour,
  passerAuJoueurSuivant,
} from "@/lib/game";

import PlayerHand from "@/components/PlayerHand";
import Pyramid from "@/components/Pyramid";
import ActionPanel from "@/components/ActionPanel";
import DonPanel from "@/components/DonPanel";
import TargetPanel from "@/components/TargetPanel";
import ResponsePanel from "@/components/ResponsePanel";


export default function DevPage() {


  const [partie, setPartie] =
    useState(
      creerPartie(4)
    );



  function nouvellePartie() {

    setPartie(
      creerPartie(4)
    );

  }




  function handleCardClick(
    ligne:number,
    colonne:number
  ){

    setPartie(
      retournerCartePyramide(
        partie,
        ligne,
        colonne
      )
    );

  }





  function handlePasser(){

    setPartie(
      passerAuJoueurSuivant(partie)
    );

  }





  function handleDonner(){

    setPartie(
      commencerDon(partie)
    );

  }





  function handleChoisirGorgees(
    nombre:number
  ){

    setPartie(
      choisirGorgees(
        partie,
        nombre
      )
    );

  }





  function handleChoisirCible(
    cible:number
  ){

    setPartie(
      choisirCible(
        partie,
        cible
      )
    );

  }





  function handleCroire(){

    setPartie(
      reponseCroire(partie)
    );

  }





  function handleDouter(){

    setPartie(
      reponseDouter(partie)
    );

  }





function handleFinTour(){

  const fin =
    terminerTour(partie);


  setPartie(
    retournerProchaineCarte(fin)
  );

}

function handleJoueurSuivant(){

  setPartie(
    passerAuJoueurSuivant(partie)
  );

}




  return (

    <main className="min-h-screen bg-zinc-950 text-white p-8">


      <h1 className="text-4xl font-bold text-yellow-500">
        🧪 Laboratoire
      </h1>




      <button

        onClick={nouvellePartie}

        className="
        mt-6
        bg-yellow-500
        text-black
        px-6
        py-3
        rounded-xl
        font-bold
        "

      >

        Nouvelle partie

      </button>





      <div className="mt-8 bg-zinc-900 rounded-xl p-5">


        <h2 className="text-2xl font-bold">
          Phase :
        </h2>


        <p className="text-yellow-500 text-3xl font-bold">
          {partie.phase}
        </p>



        {partie.carteActive && (

          <p className="mt-3 text-xl">

            🎴 Carte active :

            {" "}

            {partie.carteActive.valeur}

            {partie.carteActive.couleur}

          </p>

        )}


      </div>








      {partie.phase === "CHOIX" && (

        <ActionPanel

          joueur={
            partie.joueurQuiParle
          }

          onDonner={
            handleDonner
          }

          onPasser={
            handlePasser
          }

        />

      )}







      {partie.phase === "DON" && (

        <DonPanel

          onChoisirGorgees={
            handleChoisirGorgees
          }

        />

      )}







      {partie.phase === "CIBLE" && (

        <TargetPanel

          nombreJoueurs={
            partie.mains.length
          }

          joueurQuiDonne={
            partie.joueurQuiParle
          }

          onChoisirCible={
            handleChoisirCible
          }

        />

      )}







      {partie.phase === "REPONSE" && (

        <ResponsePanel

          onCroire={
            handleCroire
          }

          onDouter={
            handleDouter
          }

        />

      )}







{partie.phase === "RESOLUTION" && (

  <div>

    <button

      onClick={
        handleFinTour
      }

      className="
      mt-6
      bg-yellow-500
      text-black
      px-6
      py-3
      rounded-xl
      font-bold
      "

    >

      ➡️ Fin du tour

    </button>



    <button

      onClick={
        handleJoueurSuivant
      }

      className="
      mt-6
      ml-4
      bg-yellow-500
      text-black
      px-6
      py-3
      rounded-xl
      font-bold
      "

    >

      ➡️ Joueur suivant

    </button>


  </div>

)}







      {partie.dernierEvenement && (

        <div className="mt-6 bg-green-900 rounded-xl p-5">

          <h2 className="text-2xl font-bold">
            📢 Événement
          </h2>


          <p className="mt-3 text-xl">

            {partie.dernierEvenement.message}

          </p>


        </div>

      )}







      <h2 className="text-3xl font-bold text-yellow-500 mt-10 mb-6">
  👥 Joueurs
</h2>


<div className="mb-8">

  {partie.gorgeesJoueurs.map(
    (gorgees,index)=>(
      
      <p
        key={index}
        className="text-xl mt-2"
      >

        Joueur {index + 1} 🍺 :
        {" "}
        {gorgees} gorgée(s)

      </p>

    )
  )}

</div>



{partie.mains.map(

  (main,index)=>(

    <PlayerHand

      key={index}

      nom={`Joueur ${index + 1}`}

      cartes={main}

    />

  )

)}







      <h2 className="text-3xl font-bold text-yellow-500 mt-12 mb-6">
        🔺 Pyramide
      </h2>





      <Pyramid

        pyramide={
          partie.pyramide
        }

        onCardClick={
          handleCardClick
        }

      />



    </main>

  );

}

