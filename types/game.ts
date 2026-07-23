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





  // Joueur actuellement actif
  joueurQuiParle: number;





  // Actions réalisées pendant la carte
  actions: ActionJoueur[];





  // Joueurs qui doivent répondre
  joueursEnAttente: number[];





  // Dernier message du jeu
  dernierEvenement?: EvenementJeu;





  // Indique si le tour est terminé
  tourTermine: boolean;





  // Nouveau : nombre de gorgées à boire par joueur
  gorgeesJoueurs: number[];



};





export type EvenementJeu = {


  message: string;


  gorgées: number;


};