import {
  creerPaquet,
  melangerPaquet,
  distribuerCartes,
} from "@/lib/deck";

import { creerPyramide } from "@/lib/pyramid";

import { GameState } from "@/types/gameState";


export function generateGameCode() {

  const letters = "PG";

  const numbers = Math.floor(
    1000 + Math.random() * 9000
  );

  return `${letters}-${numbers}`;

}





export function creerPartie(
  nombreJoueurs: number
): GameState {


  const paquet =
    melangerPaquet(
      creerPaquet()
    );


  const {
    mains,
    paquetRestant,
  } =
    distribuerCartes(
      paquet,
      nombreJoueurs
    );



  return {

    paquet,


    mains,


    pyramide:
      creerPyramide(paquetRestant),



    cartesRestantes:
      paquetRestant.slice(15),



    carteActive:
      undefined,



    phase:
      "ATTENTE",



    joueurQuiParle:
      0,
   
      joueurActionAvantReponse:
      0,

    dernierJoueurAction:
      0,

    actions:
      [],



    joueursEnAttente:
      [],



   tourTermine:
  false,


   gorgeesJoueurs:
  Array(nombreJoueurs).fill(0),


   lignePyramide:
   0,


   colonnePyramide:
   0,



  


  };

}







export function retournerCartePyramide(
  partie: GameState,
  ligne: number,
  colonne: number
): GameState {


  const pyramide =
    partie.pyramide.map(
      ligne =>
        ligne.map(
          carte => ({
            ...carte,
          })
        )
    );



  const carte =
    pyramide[ligne][colonne];


  if (carte.revelee) {

    return partie;

  }



  carte.revelee = true;



  return {

    ...partie,


    pyramide,


    carteActive:
      carte,


    phase:
      "CHOIX",


    joueurQuiParle:
      0,


    joueursEnAttente:
      partie.mains.map(
        (_,index)=>index
      ),


    actions:
      [],


  };

}







export function passerJoueur(
  partie: GameState
): GameState {


  const attente =
    partie.joueursEnAttente.filter(
      id =>
        id !== partie.joueurQuiParle
    );


  return {

    ...partie,


    joueursEnAttente:
      attente,


    joueurQuiParle:
      attente[0] ?? 0,


  };

}

export function commencerDon(
  partie: GameState
): GameState {


  return {

    ...partie,


    phase:
      "DON",

  };

}







export function choisirGorgees(
  partie: GameState,
  nombre:number
):GameState {


  return {

    ...partie,


    phase:
      "CIBLE",


    dernierEvenement:{
      message:
      `${nombre} gorgée(s) à donner`,
      gorgées:
      nombre,
    }

  };

}







export function choisirCible(
  partie: GameState,
  cible: number
): GameState {

  const gorgées =
    partie.dernierEvenement?.gorgées ?? 0;

  const action = {

    joueur:
      partie.joueurQuiParle,

    type:
      "DONNER" as const,

    cible,

    gorgées,

  };

  return {

    ...partie,

    joueurActionAvantReponse:
      partie.joueurQuiParle,

    actions: [

      ...partie.actions,

      action,

    ],

    phase:
      "REPONSE",

    joueurQuiParle:
      cible,

    dernierEvenement: {

      message:
        `Joueur ${cible + 1} doit répondre`,

      gorgées,

    },

  };

}







export function reponseCroire(
  partie: GameState
): GameState {


  const action =
    partie.actions[
      partie.actions.length - 1
    ];


  const nouvelleGorgees =
    [...partie.gorgeesJoueurs];


  nouvelleGorgees[action.cible!] +=
    action.gorgées ?? 0;



  return {

    ...partie,


    gorgeesJoueurs:
      nouvelleGorgees,


    phase:
      "RESOLUTION",


    dernierEvenement: {

      message:
        `Joueur ${action.cible! + 1} accepte de boire ${action.gorgées} gorgée(s)`,

      gorgées:
        action.gorgées ?? 0,

    },

  };

}







export function reponseDouter(
  partie: GameState
): GameState {


  const action =
    partie.actions[
      partie.actions.length - 1
    ];



  const donneur =
    action.joueur;



  const possedeCarte =
    partie.mains[donneur].some(

      carte =>

        carte.valeur === partie.carteActive?.valeur

        &&

        carte.couleur === partie.carteActive?.couleur

    );





  const nouvelleGorgees =
    [...partie.gorgeesJoueurs];





  if (possedeCarte) {


    nouvelleGorgees[action.cible!] +=
      action.gorgées ?? 0;



    return {

      ...partie,


      gorgeesJoueurs:
        nouvelleGorgees,


      phase:
        "RESOLUTION",


      dernierEvenement: {

        message:
          `Le bluff était vrai. Joueur ${action.cible! + 1} boit ${action.gorgées} gorgée(s)`,

        gorgées:
          action.gorgées ?? 0,

      },


    };


  }





  nouvelleGorgees[donneur] +=
    (action.gorgées ?? 0) * 2;




  return {

    ...partie,


    gorgeesJoueurs:
      nouvelleGorgees,


    phase:
      "RESOLUTION",


    dernierEvenement: {

      message:
        `Bluff détecté ! Joueur ${donneur + 1} boit ${(action.gorgées ?? 0) * 2} gorgées`,

      gorgées:
        (action.gorgées ?? 0) * 2,

    },


  };


}







export function croireDon(
  partie:GameState
):GameState {


  return {

    ...partie,


    phase:
      "CHOIX",


    dernierEvenement:{

      message:
      `Joueur ${partie.joueurQuiParle+1} accepte`,

      gorgées:
      partie.dernierEvenement?.gorgées ?? 0,

    }

  };

}







export function douterDon(
  partie:GameState
):GameState {


  return {

    ...partie,


    phase:
      "RESOLUTION",


    dernierEvenement:{

      message:
      "Vérification du bluff...",


      gorgées:
      0,

    }

  };

}







export function terminerTour(
  partie: GameState
): GameState {


  return {

    ...partie,


    phase:
      "ATTENTE",


    dernierEvenement:
      undefined,


    tourTermine:
      true,


    carteActive:
      undefined,


    actions:
      [],


    joueursEnAttente:
      [],


  };

}

export function retournerProchaineCarte(
  partie: GameState
): GameState {


  const pyramide =
    partie.pyramide.map(
      ligne =>
        ligne.map(
          carte => ({
            ...carte,
          })
        )
    );


  let ligne =
    partie.lignePyramide;


  let colonne =
    partie.colonnePyramide;



  // On commence par la dernière ligne de la pyramide
  const vraieLigne =
    pyramide.length - 1 - ligne;



  if (
    vraieLigne < 0
  ) {

    return {

      ...partie,

      phase:
        "ATTENTE",

      dernierEvenement:{

        message:
          "🏁 Fin de la pyramide !",

        gorgées:
          0,

      },

    };

  }



  const carte =
    pyramide[vraieLigne][colonne];



  carte.revelee = true;



  let nouvelleColonne =
    colonne + 1;


  let nouvelleLigne =
    ligne;



  // Quand on a fini une ligne
  if (
    nouvelleColonne >= pyramide[vraieLigne].length
  ) {

    nouvelleLigne++;

    nouvelleColonne = 0;

  }



  return {

    ...partie,


    pyramide,


    carteActive:
      carte,


    lignePyramide:
      nouvelleLigne,


    colonnePyramide:
      nouvelleColonne,


    phase:
      "CHOIX",


    joueurQuiParle:
      0,


    joueursEnAttente:
      partie.mains.map(
        (_,index)=>index
      ),


    actions:
      [],

  };

}

export function passerAuJoueurSuivant(
  partie: GameState
): GameState {


  const joueursRestants =
    partie.joueursEnAttente.filter(
      id =>
        id !== partie.joueurQuiParle
    );



  // Tous les joueurs ont joué
  if (
    joueursRestants.length === 0
  ) {

    return retournerProchaineCarte(
      partie
    );

  }



  return {

    ...partie,


    phase:
      "CHOIX",


    joueurQuiParle:
      joueursRestants[0],


    joueursEnAttente:
      joueursRestants,


    actions:
      [],

  };

}