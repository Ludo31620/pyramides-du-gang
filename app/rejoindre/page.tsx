"use client";
import {
  enregistrerSessionPartie,
  type StoredGameSession,
} from "@/lib/gameSession";

import {
  getPlayerProfile,
} from "@/lib/profile/storage";

import type {
  PlayerProfile,
} from "@/lib/profile/types";

import {
  obtenirSocket,
} from "@/lib/socket";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  FormEvent,
} from "react";

import type {
  Socket,
} from "socket.io-client";





const MIN_PSEUDO_LENGTH = 2;
const MAX_PSEUDO_LENGTH = 20;

interface PublicRoomPlayer {
  id: string;
  pseudo: string;

  avatarType:
    PlayerProfile["avatarType"];

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  isHost: boolean;
}

interface PublicRoom {
  code: string;
  status:
    | "LOBBY"
    | "IN_GAME";
  maxPlayers: number;
  players: PublicRoomPlayer[];
}

type JoinRoomResult =
  | {
      success: true;
      room: PublicRoom;
      playerId: string;
    }
  | {
      success: false;
      error: string;
    };



function normaliserPseudo(
  value: string
): string {
  return value
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(
      0,
      MAX_PSEUDO_LENGTH
    );
}

function normaliserCode(
  value: string
): string {
  const cleanedValue =
    value
      .toUpperCase()
      .replace(
        /[^A-Z0-9]/g,
        ""
      )
      .slice(0, 6);

  if (
    cleanedValue.startsWith(
      "PG"
    )
  ) {
    const numbers =
      cleanedValue
        .slice(2)
        .replace(
          /\D/g,
          ""
        )
        .slice(0, 4);

    return numbers.length > 0
      ? `PG-${numbers}`
      : "PG-";
  }

  const numbers =
    cleanedValue
      .replace(
        /\D/g,
        ""
      )
      .slice(0, 4);

  return numbers.length > 0
    ? `PG-${numbers}`
    : "";
}

function codeEstValide(
  code: string
): boolean {
  return /^PG-\d{4}$/.test(
    code
  );
}

function connecterSocket(
  socket: Socket
): Promise<void> {
  if (socket.connected) {
    return Promise.resolve();
  }

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const timeoutId =
        window.setTimeout(
          () => {
            nettoyer();

            reject(
              new Error(
                "Le serveur ne répond pas."
              )
            );
          },
          8000
        );

      function nettoyer(): void {
        window.clearTimeout(
          timeoutId
        );

        socket.off(
          "connect",
          gererConnexion
        );

        socket.off(
          "connect_error",
          gererErreur
        );
      }

      function gererConnexion(): void {
        nettoyer();
        resolve();
      }

      function gererErreur(
        error: Error
      ): void {
        nettoyer();
        reject(error);
      }

      socket.once(
        "connect",
        gererConnexion
      );

      socket.once(
        "connect_error",
        gererErreur
      );

      socket.connect();
    }
  );
}

function rejoindreSalon(
  socket: Socket,
  pseudo: string,
  code: string,
  profile: PlayerProfile
): Promise<JoinRoomResult> {
  return new Promise(
    (
      resolve
    ) => {
      let reponseRecue =
        false;

      const timeoutId =
        window.setTimeout(
          () => {
            if (
              reponseRecue
            ) {
              return;
            }

            reponseRecue =
              true;

            resolve({
              success: false,
              error:
                "Le serveur n'a pas répondu à temps.",
            });
          },
          8000
        );

      socket.emit(
        "room:join",
        {
          pseudo,

          avatarType:
            profile.avatarType,

          avatarId:
            profile.avatarId,

          avatarPhoto:
            profile.avatarPhoto,

          code,
        },
        (
          result:
            JoinRoomResult
        ) => {
          if (
            reponseRecue
          ) {
            return;
          }

          reponseRecue =
            true;

          window.clearTimeout(
            timeoutId
          );

          resolve(result);
        }
      );
    }
  );
}

export default function RejoindrePage() {
  const router =
    useRouter();

  const [
    pseudo,
    setPseudo,
  ] = useState("");

  const [
    code,
    setCode,
  ] = useState("");

  const [
    connexionEnCours,
    setConnexionEnCours,
  ] = useState(false);

  const [
    messageErreur,
    setMessageErreur,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const profile =
      getPlayerProfile();

    if (
      profile.pseudo &&
      profile.pseudo !==
        "Joueur"
    ) {
      setPseudo(
        profile.pseudo
      );
    }
  }, []);

  const formulaireValide =
    useMemo(() => {
      const pseudoNettoye =
        pseudo.trim();

      return (
        pseudoNettoye.length >=
          MIN_PSEUDO_LENGTH &&
        pseudoNettoye.length <=
          MAX_PSEUDO_LENGTH &&
        codeEstValide(code)
      );
    }, [
      pseudo,
      code,
    ]);

  function gererPseudo(
    value: string
  ): void {
    setPseudo(
      normaliserPseudo(
        value
      )
    );

    if (messageErreur) {
      setMessageErreur(null);
    }
  }

  function gererCode(
    value: string
  ): void {
    setCode(
      normaliserCode(
        value
      )
    );

    if (messageErreur) {
      setMessageErreur(null);
    }
  }

  async function gererSoumission(
    event:
      FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (
      connexionEnCours
    ) {
      return;
    }

    const pseudoNettoye =
      pseudo.trim();

    const codeNettoye =
      code
        .trim()
        .toUpperCase();

    if (
      pseudoNettoye.length <
      MIN_PSEUDO_LENGTH
    ) {
      setMessageErreur(
        "Ton pseudo doit contenir au moins 2 caractères."
      );

      return;
    }

    if (
      pseudoNettoye.length >
      MAX_PSEUDO_LENGTH
    ) {
      setMessageErreur(
        "Ton pseudo ne peut pas dépasser 20 caractères."
      );

      return;
    }

    if (
      !codeEstValide(
        codeNettoye
      )
    ) {
      setMessageErreur(
        "Le code doit être au format PG-1234."
      );

      return;
    }

    setConnexionEnCours(
      true
    );

    setMessageErreur(null);

    try {
      const profile =
        getPlayerProfile();

      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

console.log("=== AVANT JOIN ===");
console.log("socket.id :", socket.id);
console.log("socket.connected :", socket.connected);
console.log("code demandé :", codeNettoye);

const result =
  await rejoindreSalon(
    socket,
    pseudoNettoye,
    codeNettoye,
    profile
  );

console.log("=== APRÈS JOIN ===");
console.log(result);



        console.log("CODE DEMANDÉ :", codeNettoye);
console.log("RÉSULTAT SERVEUR :", result);

      if (!result.success) {
        setMessageErreur(
          result.error
        );

        return;
      }

const joueurLocal =
  result.room.players.find(
    (player) =>
      player.id ===
      result.playerId
  );

if (!joueurLocal) {
  setMessageErreur(
    "Le serveur n'a pas pu identifier ton joueur."
  );

  return;

}

const session: StoredGameSession = {
  code:
    result.room.code,

  playerId:
    result.playerId,

  pseudo:
    joueurLocal.pseudo,

  isHost:
    joueurLocal.isHost,

  maxPlayers:
    result.room.maxPlayers,

players:
  result.room.players.map(
    (player) => ({
      id:
        player.id,

      pseudo:
        player.pseudo,

      avatarType:
        player.avatarType,

      avatarId:
        player.avatarId,

      avatarPhoto:
        player.avatarPhoto,

      isHost:
        player.isHost,
    })
  ),

  playerCount:
    result.room.players.length,
};

enregistrerSessionPartie(
  session
);

router.replace(
  "/lobby"
);


    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible de rejoindre la partie :",
        error
      );

      setMessageErreur(
        error instanceof Error
          ? error.message
          : "Impossible de rejoindre la partie."
      );
    } finally {
      setConnexionEnCours(
        false
      );
    }
  }

  function retournerAccueil():
    void {
    router.push("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0E13] px-5 py-8 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#FFD166]/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <header className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FFD166]/30 bg-[#FFD166]/10 text-2xl text-[#FFD166] shadow-[0_0_30px_rgba(255,209,102,0.12)]">
            △
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-[#FFD166]">
            Pyramide du Gang
          </p>

<h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
  Prêt à jouer ?
</h1>

<p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-400">
  Entrez le code de la partie pour rejoindre vos amis.
</p>

        </header>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#15181F] p-5 shadow-2xl shadow-black/30 sm:p-7">
<div className="mb-6">
  <h2 className="text-xl font-black text-white">
    Rejoindre une partie
  </h2>
</div>

          <form
            onSubmit={
              gererSoumission
            }
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="pseudo"
                className="block text-sm font-black text-white"
              >
                Ton pseudo
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Entre 2 et 20 caractères
              </p>

              <input
                id="pseudo"
                name="pseudo"
                type="text"
                autoComplete="nickname"
                autoCapitalize="words"
                maxLength={
                  MAX_PSEUDO_LENGTH
                }
                value={pseudo}
                onChange={(
                  event
                ) =>
                  gererPseudo(
                    event.target.value
                  )
                }
                disabled={
                  connexionEnCours
                }
                placeholder="Exemple : Pierre"
                className="mt-3 min-h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-base font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-black text-white"
              >
                Code de la partie
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Le code commence par PG
              </p>

              <input
                id="code"
                name="code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                inputMode="numeric"
                value={code}
                onChange={(
                  event
                ) =>
                  gererCode(
                    event.target.value
                  )
                }
                disabled={
                  connexionEnCours
                }
                placeholder="PG-1234"
                className="mt-3 min-h-16 w-full rounded-2xl border border-[#FFD166]/20 bg-black/25 px-4 text-center text-2xl font-black uppercase tracking-[0.16em] text-[#FFD166] outline-none transition placeholder:tracking-[0.12em] placeholder:text-zinc-700 focus:border-[#FFD166]/60 focus:ring-4 focus:ring-[#FFD166]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {messageErreur && (
              <div
                role="alert"
                className="rounded-2xl border border-red-900 bg-red-950/50 p-4 text-sm font-semibold leading-6 text-red-300"
              >
                {messageErreur}
              </div>
            )}

            <button
              type="submit"
              disabled={
                !formulaireValide ||
                connexionEnCours
              }
              className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#FFD166] px-5 py-4 font-black text-[#111318] transition hover:bg-[#FFDA7A] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {connexionEnCours ? (
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#111318] border-r-transparent" />

                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Rejoindre la partie

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/15 px-4 py-4">
            <p className="text-center text-xs leading-5 text-zinc-500">
              Chaque joueur doit ouvrir le jeu sur son propre téléphone et utiliser le même code.
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={
            retournerAccueil
          }
          disabled={
            connexionEnCours
          }
          className="mt-5 min-h-12 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:bg-white/5 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Retour à l&apos;accueil
        </button>

        <footer className="mt-auto pt-8 text-center text-xs text-zinc-600">
          Pyramide du Gang · by{" "}
          <span className="font-bold text-[#FFD166]">
            Ludo B
          </span>
        </footer>
      </div>
    </main>
  );
}