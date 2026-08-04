export type PlayerAvatarType =
  | "DEFAULT"
  | "PHOTO"
  | "NONE";

export interface PlayerProfile {
  /**
   * Nom affiché dans le lobby,
   * pendant la partie et sur le profil.
   */
  pseudo: string;

  /**
   * Type d’avatar actuellement utilisé.
   */
  avatarType:
    PlayerAvatarType;

  /**
   * Identifiant d’un avatar intégré.
   *
   * Exemple :
   * "fox", "wolf" ou "dragon".
   */
  avatarId:
    string | null;

  /**
   * Photo personnalisée encodée
   * sous forme de Data URL.
   *
   * Elle reste null lorsqu’un avatar
   * intégré est utilisé.
   */
  avatarPhoto:
    string | null;
}

export const DEFAULT_PLAYER_PROFILE:
  PlayerProfile = {
  pseudo:
    "Joueur",

  avatarType:
    "DEFAULT",

  avatarId:
    "fox",

  avatarPhoto:
    null,
};
