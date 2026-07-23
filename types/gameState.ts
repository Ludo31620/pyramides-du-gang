import { Carte } from "@/lib/deck";


export type PhaseJeu =
  | "ATTENTE"
  | "CHOIX"
  | "DON"
  | "CIBLE"
  | "REPONSE"
  | "RESOLUTION";



export type TypeAction =
  | "DONNER"
  | "PASSER";



export type ActionJoueur = {

  joueur: number;

  type: TypeAction;

  cible?: number;

  gorgées?: number;

};





export type GameState = {


  paquet: Carte[];


  mains: Carte[][];


  pyramide: Carte[][];


  cartesRestantes: Carte[];




  carteActive?: Carte;





  phase: PhaseJeu;





  // Joueur actuellement invité à jouer
  joueurQuiParle: number;

  joueurActionAvantReponse: number;

dernierJoueurAction: number;


  // Actions réalisées pendant la carte actuelle
  actions: ActionJoueur[];





  // Joueurs qui doivent encore répondre
  joueursEnAttente: number[];





  // Dernier message affiché
  dernierEvenement?: EvenementJeu;





  // Nouveau : indique si la résolution de la carte est terminée
  tourTermine: boolean;

  gorgeesJoueurs: number[];

  lignePyramide: number;

colonnePyramide: number;


};





export type EvenementJeu = {


  message: string;


  gorgées: number;


};