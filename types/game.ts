export type Joueur = {
  id: string;
  pseudo: string;
  hote: boolean;
};

export type Partie = {
  code: string;
  nombreJoueursMax: number;
  joueurs: Joueur[];
};